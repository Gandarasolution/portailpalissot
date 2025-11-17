<?php
// $AbsPath = $_SERVER['DOCUMENT_ROOT'] . "/";
// require_once($AbsPath.'extranet/inc_include/header_ajax_json.inc.php');

header('Access-Control-Allow-Origin: *');

//exit(phpinfo());
if (!isset($_GET["endpoint"])) {

	exit(phpinfo());
} else {



	//ini_set("soap.wsdl_cache_enabled", 1);
	//ini_set("soap.wsdl_cache_ttl", 3600);


	ini_set("soap.wsdl_cache_enabled", "0");

	$g_paramAPICCSToUpdate = array("FeuilleHeure");
	$g_xmlnsToAdd = "http://schemas.datacontract.org/2004/07/WSGandaraServiceWCF";

	//require_once("NuSoap/lib/nusoap.php");

	$g_namespaceGandara = "http://tempuri.org/IWSGandara/";

	$g_useSoapClientV2 = true;

	class MSSoapClient extends SoapClient
	{
		private $ws = "";
		private $opts = array();
		private $arrFonctions = array();
		private $responsePrevious;

		function __construct($wsdl, $options)
		{
			try {
				$options["exceptions"] = true;

				parent::__construct($wsdl, $options);

				//echo $wsdl;
				$this->ws = $wsdl;
				$this->opts = $options;
				$this->arrFonctions = parent::__getFunctions();
				//var_dump($this->arrFonctions);		
			} catch (Exception $e) {
				echo ($e->getMessage());
				error_log($e->getMessage());
			}

		}

		function __soapcall($name, $args, $options = NULL, $input_headers = NULL, &$output_headers = NULL)
		{
			$result = null;
			try {
				$fctExists = false;
				foreach ($this->arrFonctions as $nameFct) {
					//echo "<br/>$nameFct,$name".strpos($nameFct,$name."(");
					if (strpos($nameFct, $name . "(") !== FALSE) {
						$fctExists = true;
						break;
					}
				}

				//Vérification si la fonction existe sinon FATAL
				if ($fctExists) {
					if ($options == null)
						$options = $this->opts;

					$result = parent::__soapcall($name, $args, $options, $input_headers, $output_headers);
				} else {

					//echo("Fonction WS $name inconnu ({$this->ws})");

					error_log("Fonction WS $name inconnu ({$this->ws})");

				}
			} catch (Exception $e) {
				//error_log($e->getMessage());
			}
			return $result;
		}

		function __doRequest($request, $location, $action, $version, $oneWay = false)
		{
			global $responsePrevious;
			try {
				$namespace = "http://tempuri.org/";

				$dtStarted = time();
				$requestOrigin = $request;

				$request = preg_replace('/<ns1:(\w+)/', '<$1 xmlns="' . $namespace . '"', $request, 1);
				$request = preg_replace('/<ns1:(\w+)/', '<$1', $request);
				$request = str_replace(array('/ns1:', 'xmlns:ns1="' . $namespace . '"'), array('/', ''), $request);

				//error_log($request);

				// parent call
				$response = parent::__doRequest($request, $location, $action, $version, $oneWay);

				$dtEnd = time();
				$dureeRqt = ($dtEnd - $dtStarted) / 100;
				if ($dureeRqt > 1) {
					error_log("{$this->ws} : Lente rqt : $requestOrigin ($dureeRqt sec)");
				}
			} catch (Exception $e) {
				error_log($e->getMessage());
				$response = null;
			}

			//error_log($response);
			$responsePrevious = $response;
			return $response;
		}

		function getError()
		{
			global $responsePrevious;
			if (isset($responsePrevious->faultstring)) {
				return $responsePrevious->faultstring;
			} else if ($responsePrevious == null) {
				return "Erreur de connexion";
			}
			return false;
		}
	}


	function IsURICannonical($uri)
	{
		$mysqlClient = new PDO('mysql:host=localhost:3306;dbname=extranet;charset=utf8', 'palissot', 'loi2WfsBTAgRob2H');
		$params = [];
		//URL
		$sqlQuery = 'SELECT * FROM config_client WHERE urlCannoniqueGMAO = :url';

		$params = ['url' => $uri];
		$sth = $mysqlClient->prepare($sqlQuery);
		$sth->execute($params);
		$response = $sth->fetchAll();

		if (count($response) === 0) {
			return 0;
		}
		return 1;
	}

	function GetURLWsEntreprise($codeEntreprise)
	{
		$actual_link = strtok("https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]", '?');

		$request = array("codeEntreprise" => $codeEntreprise);


		$mysqlClient = new PDO('mysql:host=localhost:3306;dbname=extranet;charset=utf8', 'palissot', 'loi2WfsBTAgRob2H');

		$params = [];
		if (strpos($codeEntreprise, 'gandarasolution') || strpos($codeEntreprise, ':')) {
			//URL
			$sqlQuery = 'SELECT * FROM config_client WHERE urlCannoniqueGMAO = :url';

			$params = ['url' => $codeEntreprise];
		} else {
			//Code
			$sqlQuery = 'SELECT * FROM config_client WHERE codeEntrepriseGMAO = :code';

			$params = ['code' => $codeEntreprise];

		}

		$sth = $mysqlClient->prepare($sqlQuery);
		// $sth->execute(['code'=>$codeEntreprise]);
		$sth->execute($params);
		$response = $sth->fetchAll();
		if ($response[0]["urlCannoniqueGMAO"] === $codeEntreprise || $response[0]["codeEntrepriseGMAO"] === $codeEntreprise) {

			$g_uploadLogo = '/data/Extranet/tmp/logoClient/';
			$logoGMAO = $response[0]["cheminLogoGMAO"];
			$path = $g_uploadLogo . '/' . $logoGMAO;
			$type = pathinfo($path, PATHINFO_EXTENSION);
			$data = file_get_contents($path);
			$base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

			$responseArray = [];
			$responseArray["urlWSEndpoint"] = $response[0]["urlWSClient"];
			// $responseArray["urlWSClient"] = "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
			$responseArray["urlWSClient"] = $actual_link . '?endpoint=GMAO';
			// $responseArray["themeClient"] = "theme-color-1";
			$responseArray["themeClient"] = $response[0]["themeGMAO"];
			$responseArray["logoClient"] = $base64;

		}


		return json_encode($responseArray);
		// return "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
	}

	function ConnexionGMAO($login, $pass_clear, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("login" => $login, "pass_clear" => $pass_clear);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));

			//var_dump($client->__getFunctions());
			$result = $client->__soapCall("GMAOConnexion", array("parameters" => $request));
			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOConnexion", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {
			if ($result["GMAOConnexionResult"]) {
				return $result["GMAOConnexionResult"];
			} else {
				return "500";
			}
		}

	}


	function GetPrestationContrat($token, $dateDebut, $dateFin, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "dateDebut" => $dateDebut, "dateFin" => $dateFin, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetPrestationContrat", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetPrestationContrat", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetPrestationContratResult"]["PrestationContrat"])) {
				return json_encode($result["GMAOGetPrestationContratResult"]["PrestationContrat"]);

			} else {
				return "500";
			}
		}
	}




	function GetDocumentPrestation($token, $IdDossierIntervention, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdDossierIntervention" => $IdDossierIntervention);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentsPrestation", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentsPrestation", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentsPrestationResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentsPrestationResult"]["KV"]);

			} 
			elseif(isset($result["GMAOGetDocumentsPrestationResult"])){
				return json_encode($result["GMAOGetDocumentsPrestationResult"]);
			}
			else {
				return "500";
			}
		}
	}

	function File64($b64string = "", $fileName = "")
	{


		$file = base64_decode($b64string);
		file_put_contents($fileName, $file);

		return ($fileName);

	}

	function VoirDocument($fileName = "")
	{

		$fileN = $fileName;


		$extension = pathinfo($fileN, PATHINFO_EXTENSION);

		//Ajoute le header du documents selon son extension
		switch ($extension) {
			case 'pdf':
				header('Content-type: application/pdf');
				break;
			case 'jpg':
			case 'png':
				header('Content-type: image/jpeg');
				break;
			case 'doc':
			case 'docx':
				header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
				break;
			case 'xlsx':
			case 'xls':
			case 'cls':
				header('Content-type: application/vnd.ms-excel');
				break;
			default:
				break;
		}

		header('Content-Disposition: inline; filename="' . $fileN . '"');
		header('Content-Transfer-Encoding: binary');
		header('Accept-Ranges: bytes');

		flush(); // Pas nécessaire mais peut gagner a peine de temps

		//lire le fichier 
		$fp = fopen($fileName, "r");
		while (!feof($fp)) {
			//La ligne en binaire 65536 octets
			echo fread($fp, 65536);
			flush(); // Obligatoire pour fichier un peu volumineux
		}

		fclose($fp);
		//Supprime le fichier car il ne sera plus utilisé
		unlink($fileName);

	}



	function TelechargerDocument($fileName)
	{

		$fileN = $fileName;

		header("Content-Disposition: attachment; filename=" . urlencode($fileN));
		header("Content-Type: application/octet-stream");
		header("Content-Type: application/download");
		header("Content-type: application/pdf");

		header('Content-Type: application/zip');


		header("Content-Description: File Transfer");
		header("Content-Length: " . filesize($fileN));


		flush(); // Pas nécessaire mais peut gagner a peine de temps

		//lire le fichier 
		$fp = fopen($fileName, "r");
		while (!feof($fp)) {
			//La ligne en binaire 65536 octets
			echo fread($fp, 65536);
			flush(); // Obligatoire pour fichier un peu volumineux
		}

		fclose($fp);
		//Supprime le fichier car il ne sera plus utilisé
		unlink($fileName);


	}



	function DownloadZIP($arrayDocs, $fileName)
	{

		$files = array();
		foreach ($arrayDocs as $value) {

			$files[] = File64($value[0], $value[1]);

		}

		$zipname = $fileName . ".zip";
		$zip = new ZipArchive;
		$zip->open($zipname, ZipArchive::CREATE);
		foreach ($files as $file) {
			$zip->addFile($file);
		}
		$zip->close();

		foreach ($files as $file) {
			unlink($file);
		}

		echo ($zipname);

	}


	function GetClientSiteBySearch($token, $search, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "search" => $search);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetClientSiteBySearch", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetClientSiteBySearch", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetClientSiteBySearchResult"]["ClientSiteContrat"])) {
				return json_encode($result["GMAOGetClientSiteBySearchResult"]["ClientSiteContrat"]);

			} else {
				return "500";
			}
		}
	}



	function GetClientSiteContrat($token, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetClientSiteContrat", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetClientSiteContrat", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetClientSiteContratResult"]["ClientSiteContrat"])) {
				return json_encode($result["GMAOGetClientSiteContratResult"]["ClientSiteContrat"]);

			} else {
				return "500";
			}
		}
	}



	function GetListeTaches($token, $IdPrestationContrat, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdPrestationContrat" => $IdPrestationContrat);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeTaches", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeTaches", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeTachesResult"]["KV"])) {
				return json_encode($result["GMAOGetListeTachesResult"]["KV"]);

			} else {
				return "500";
			}
		}
	}



	function SetLastSiteVisite($token, $guid, $ws)
	{

		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOSetLastSiteVisite", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOSetLastSiteVisite", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOSetLastSiteVisiteResult"])) {
				return json_encode($result["GMAOGSetLastSiteVisite"]);

			} else {
				return "500";
			}
		}


	}


	function GetDashboardData($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDashboardData", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDashboardData", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDashboardDataResult"])) {
				return json_encode($result["GMAOGetDashboardDataResult"]);

			} else {
				return "500";
			}
		}
	}


	function GetAppareils($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetAppareils", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetAppareils", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetAppareilsResult"]["AppareilSecteur"])) {
				return json_encode($result["GMAOGetAppareilsResult"]["AppareilSecteur"]);

			} else {
				return "500";
			}
		}
	}



	function GetListeParametres($token, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeParametres", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeParametres", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeParametresResult"]["KV"])) {
				return json_encode($result["GMAOGetListeParametresResult"]["KV"]);

			} else {
				return "500";
			}
		}
	}



	function GetFactures($token, $dateDebut, $dateFin, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "dateDebut" => $dateDebut, "dateFin" => $dateFin, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetFactures", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetFactures", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetFacturesResult"]["Facture"])) {
				return json_encode($result["GMAOGetFacturesResult"]["Facture"]);

			} else {
				return "500";
			}
		}
	}

	function GetFactureDocument($token, $IdFacture, $TypeFacture, $Avoir, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdFacture" => $IdFacture, "TypeFacture" => $TypeFacture, "Avoir" => $Avoir);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetFactureDocument", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetFactureDocument", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetFactureDocumentResult"])) {
				return json_encode($result["GMAOGetFactureDocumentResult"]);

			} else {
				return "500";
			}
		}
	}



	function GetListeSecteur($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeSecteur", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeSecteur", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeSecteurResult"]["KV"])) {
				return json_encode($result["GMAOGetListeSecteurResult"]["KV"]);

			} else {
				return "500";
			}
		}
	}





	function GetListeFIIntervention($token, $IdDossierInterventionSAV, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdDossierInterventionSAV" => $IdDossierInterventionSAV);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeFIIntervention", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeFIIntervention", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeFIInterventionResult"]["KV"])) {
				return json_encode($result["GMAOGetListeFIInterventionResult"]["KV"]);

			} else {
				return "500";
			}
		}
	}

	function GetListeInterventions($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeInterventions", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeInterventions", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeInterventionsResult"]["DossierInterventionSAV"])) {
				return json_encode($result["GMAOGetListeInterventionsResult"]["DossierInterventionSAV"]);

			} else {
				return "500";
			}
		}
	}




	function GeTListeFactureIntervention($token, $IdDossierInterventionSAV, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdDossierInterventionSAV" => $IdDossierInterventionSAV);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGeTListeFactureIntervention", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGeTListeFactureIntervention", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGeTListeFactureInterventionResult"]["KV"])) {
				return json_encode($result["GMAOGeTListeFactureInterventionResult"]["KV"]);

			} else {
				return "500";
			}
		}
	}







	function GetDocumentFISAV($token, $IdFicheInterventionSAV, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdFicheInterventionSAV" => $IdFicheInterventionSAV);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentFISAV", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentFISAV", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentFISAVResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentFISAVResult"]["KV"]);
			} elseif (isset($result["GMAOGetDocumentFISAVResult"])) {
				return json_encode($result["GMAOGetDocumentFISAVResult"]);
			} else {
				return "500";
			}
		}
	}






	function GetDocumentPrestationRapport($token, $IdMobiliteIntervention, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdMobiliteIntervention" => $IdMobiliteIntervention);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentPrestationRapport", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentPrestationRapport", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentPrestationRapportResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentPrestationRapportResult"]["KV"]);
			} elseif (isset($result["GMAOGetDocumentPrestationRapportResult"])) {
				return json_encode($result["GMAOGetDocumentPrestationRapportResult"]);
			} else {
				return "500";
			}
		}
	}





	function GetDocumentPrestationCERFA($token, $IdMobiliteIntervention, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdMobiliteIntervention" => $IdMobiliteIntervention);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentPrestationCERFA", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentPrestationCERFA", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentPrestationCERFAResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentPrestationCERFAResult"]["KV"]);
			} elseif (isset($result["GMAOGetDocumentPrestationCERFAResult"])) {
				return json_encode($result["GMAOGetDocumentPrestationCERFAResult"]);
			} else {
				return "500";
			}
		}
	}


	function GetDocumentPrestationTicket($token, $IdPJ, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdPJ" => $IdPJ);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentPrestationTicket", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentPrestationTicket", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentPrestationTicketResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentPrestationTicketResult"]["KV"]);
			} elseif (isset($result["GMAOGetDocumentPrestationTicketResult"])) {
				return json_encode($result["GMAOGetDocumentPrestationTicketResult"]);
			} else {
				return "500";
			}
		}
	}



	function GetDocumentPrestationExtranet($token, $fullPath, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "fullPath" => $fullPath);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetDocumentPrestationExtranet", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetDocumentPrestationExtranet", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetDocumentPrestationExtranetResult"]["KV"])) {
				return json_encode($result["GMAOGetDocumentPrestationExtranetResult"]["KV"]);
			} elseif (isset($result["GMAOGetDocumentPrestationExtranetResult"])) {
				return json_encode($result["GMAOGetDocumentPrestationExtranetResult"]);
			} else {
				return "500";
			}
		}
	}



	function GetListeDevis($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetListeDevis", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetListeDevis", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetListeDevisResult"]["Devis"])) {
				return json_encode($result["GMAOGetListeDevisResult"]["Devis"]);
			} else {
				return "500";
			}
		}
	}







	function GetdocumentDevis($token, $IdDevis, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "IdDevis" => $IdDevis);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetdocumentDevis", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetdocumentDevis", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetdocumentDevisResult"]["KV"])) {
				return json_encode($result["GMAOGetdocumentDevisResult"]["KV"]);
			} elseif (isset($result["GMAOGetdocumentDevisResult"])) {
				return json_encode($result["GMAOGetdocumentDevisResult"]);
			} else {
				return "500";
			}
		}
	}






	function ListeTelsSelect($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOListeTelsSelect", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOListeTelsSelect", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOListeTelsSelectResult"]["KV"])) {
				return json_encode($result["GMAOListeTelsSelectResult"]["KV"]);
			} elseif (isset($result["GMAOListeTelsSelectResult"])) {
				return json_encode($result["GMAOListeTelsSelectResult"]);
			} else {
				return "500";
			}
		}
	}








	function ListeMailsSelect($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOListeMailsSelect", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOListeMailsSelect", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOListeMailsSelectResult"]["KV"])) {
				return json_encode($result["GMAOListeMailsSelectResult"]["KV"]);
			} elseif (isset($result["GMAOListeMailsSelectResult"])) {
				return json_encode($result["GMAOListeMailsSelectResult"]);
			} else {
				return "500";
			}
		}
	}









	function GetNombrePortails($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetNombrePortails", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetNombrePortails", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetNombrePortailsResult"]["KV"])) {
				return json_encode($result["GMAOGetNombrePortailsResult"]["KV"]);
			} elseif (isset($result["GMAOGetNombrePortailsResult"])) {
				return json_encode($result["GMAOGetNombrePortailsResult"]);
			} else {
				return "500";
			}
		}
	}






	function GetContratPrestationPeriodes($token, $guid, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "guid" => $guid);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOGetContratPrestationPeriodes", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOGetContratPrestationPeriodes", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			if (isset($result["GMAOGetContratPrestationPeriodesResult"]["KV"])) {
				return json_encode($result["GMAOGetContratPrestationPeriodesResult"]["KV"]);
			} elseif (isset($result["GMAOGetContratPrestationPeriodesResult"])) {
				return json_encode($result["GMAOGetContratPrestationPeriodesResult"]);
			} else {
				return "500";
			}
		}
	}



	function UpdateMdp($token, $newMdp, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "newMdp" => $newMdp);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAO_UpdateMdp", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAO_UpdateMdp", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			return json_encode($result["GMAO_UpdateMdpResult"]);

		}
	}








	function CreateTokenMDP($mail, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("mail" => $mail);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOCreateTokenMDP", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOCreateTokenMDP", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			return json_encode($result["GMAOCreateTokenMDPResult"]);

		}
	}


	function ChangeMDP($token, $newMDP, $ws)
	{
		global $URL_API_CCS, $g_useSoapClientV2;
		$request = array("token" => $token, "newMDP" => $newMDP);

		if ($g_useSoapClientV2) {
			$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
			$result = $client->__soapCall("GMAOChangeMDP", array("parameters" => $request));

			if (is_object($result)) {
				$result = json_decode(json_encode($result), true);
			}
		} else {
			$client = new nusoap_client($ws, true);
			$client->soap_defencoding = 'UTF-8';
			$client->decode_utf8 = false;
			$result = $client->call("GMAOChangeMDP", $request, "http://tempuri.org/IWSGandara/", "", false, false);
		}

		$error = $client->getError();


		if ($error) {
			error_log($error);
			return $error;
		} else {

			return json_encode($result["GMAOChangeMDPResult"]);

		}
	}



	function CallENDPOINT($url, $endpoint)
	{
		switch ($endpoint) {

			case "GMAOIsURICannonical":
				echo (IsURICannonical(($_POST["uri"])));
				break;

			case "GMAOGetDashboardData":
				echo (GetDashboardData($_POST['token'], $_POST['guid'], $url));
				break;

			case "GMAOSetLastSite":
				echo (SetLastSiteVisite($_POST['token'], $_POST['guid'], $url));
				break;

			case "GMAOGetURLWsEntreprise":
				echo (GetURLWsEntreprise($_POST['codeEntreprise']));
				break;
			case "GMAOCreateTokenMDP":
				echo (CreateTokenMDP($_POST['mail'], $url));
				break;

			case "GMAOChangeMDP":
				echo (ChangeMDP($_POST['token'], $_POST['newMDP'], $url));
				break;

			case "GMAO_UpdateMdp":
				echo (UpdateMdp($_POST['token'], $_POST['newMdp'], $url));
				break;

			case "GMAOConnexion":
				echo (ConnexionGMAO($_POST['login'], $_POST['pass_clear'], $url));
				//echo(ConnexionGMAO('a@a.fr','Youforlife',$url));

				break;
			case "GMAOGetClientSiteContrat":
				echo (GetClientSiteContrat($_POST['token'], $url));

				break;

			case "GMAOGetClientSiteBySearch":
				echo (GetClientSiteBySearch($_POST['token'], $_POST['search'], $url));
				break;

			case "GMAOGetPrestationContrat":
				echo (GetPrestationContrat($_POST['token'], $_POST['dateDebut'], $_POST['dateFin'], $_POST['guid'], $url));

				break;
			case "GMAOGetDocumentsPrestation":
				echo (GetDocumentPrestation($_POST['token'], $_POST['IdDossierIntervention'], $url));

				break;
			case "GMAOFile64":
				echo (File64($_POST['b64'], $_POST['filename']));

				break;
			case "GMAOSeeDocument":
				return VoirDocument($_GET['filename']);

				break;
			case "GMAOSeeDocumentOffice":
				return VoirDocumentOffice($_GET['filename']);

				break;
			case "GMAODownloadDocument":
				return TelechargerDocument($_GET['filename']);

				break;
			case "GMAOZIPDocs":
				return DownloadZIP($_POST['arrayDocs'], $_POST['filename']);

				break;
			case "GMAOGetListeTaches":
				echo (GetListeTaches($_POST['token'], $_POST['IdPrestationContrat'], $url));

				break;
			case "GMAOGetAppareils":
				echo (GetAppareils($_POST['token'], $_POST['guid'], $url));

				break;
			case "GMAOGetListeParametres":
				echo (GetListeParametres($_POST['token'], $url));

				break;
			// echo (GetFactures($_POST['token'], $_POST['dateDebut'], $_POST['dateFin'], $_POST['guid'], $url));
			case "GMAOGetFactures":
				echo (GetFactures($_POST['token'], $_POST['dateDebut'], $_POST['dateFin'], $_POST['guid'], $url));

				break;
			case "GMAOGetFactureDocument":
				echo (GetFactureDocument($_POST['token'], $_POST['IdFacture'], $_POST['TypeFacture'], $_POST['Avoir'], $url));

				break;

			case "GMAOGetListeSecteur":
				echo (GetListeSecteur($_POST["token"], $_POST["guid"], $url));

				break;


			case "GMAOGetListeInterventions":
				echo (GetListeInterventions($_POST["token"], $_POST["guid"], $url));
				break;



			case "GMAOGetListeFIIntervention":
				echo (GetListeFIIntervention($_POST['token'], $_POST['IdDossierInterventionSAV'], $url));
				break;



			case "GMAOGeTListeFactureIntervention":
				echo (GeTListeFactureIntervention($_POST['token'], $_POST['IdDossierInterventionSAV'], $url));
				break;
			case "GMAOGetDocumentFISAV":
				echo (GetDocumentFISAV($_POST['token'], $_POST['IdFicheInterventionSAV'], $url));
				break;


			case "GMAOGetDocumentPrestationRapport":
				echo (GetDocumentPrestationRapport($_POST['token'], $_POST['IdMobiliteIntervention'], $url));
				break;



			case "GMAOGetDocumentPrestationCERFA":
				echo (GetDocumentPrestationCERFA($_POST['token'], $_POST['IdMobiliteIntervention'], $url));
				break;



			case "GMAOGetDocumentPrestationTicket":
				echo (GetDocumentPrestationTicket($_POST['token'], $_POST['IdPJ'], $url));
				break;

			case "GMAOGetDocumentPrestationExtranet":
				echo (GetDocumentPrestationExtranet($_POST['token'], $_POST['fullPath'], $url));
				break;



			case "GMAOGetListeDevis":
				echo (GetListeDevis($_POST['token'], $_POST['guid'], $url));
				break;


			case "GMAOGetdocumentDevis":
				echo (GetdocumentDevis($_POST['token'], $_POST['IdDevis'], $url));
				break;


			case "GMAOListeTelsSelect":
				echo (ListeTelsSelect($_POST['token'], $_POST['guid'], $url));
				break;


			case "GMAOListeMailsSelect":
				echo (ListeMailsSelect($_POST['token'], $_POST['guid'], $url));
				break;

			case "GMAOGetNombrePortails":
				echo (GetNombrePortails($_POST['token'], $_POST['guid'], $url));
				break;

			case "GMAOGetContratPrestationPeriodes":
				echo (GetContratPrestationPeriodes($_POST['token'], $_POST['guid'], $url));
				break;

			default:
				header("HTTP/1.1 500 Internal Server Error");


		}

	}


	//$url = "http://webservices.gandarasolution.fr:8039/WSGandara?wsdl";
	$url = "http://support.palissot.fr:8038/WSGandara?wsdl";

	if ($_GET["ws"]) {
		$url = $_GET["ws"];
	}

	$terminaison = $_GET["endpoint"];
	$callToWS = CallENDPOINT($url, $terminaison);





}



?>