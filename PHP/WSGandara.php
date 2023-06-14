<?php
header('Access-Control-Allow-Origin: *');

ini_set("soap.wsdl_cache_enabled", 1);
ini_set("soap.wsdl_cache_ttl", 3600);

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

	function __construct($wsdl, $options) {
		try{
			$options["exceptions"] = true;

			parent::__construct($wsdl, $options);
		
			//echo $wsdl;
			$this->ws = $wsdl;
			$this->opts = $options;
			$this->arrFonctions = parent::__getFunctions();
		}
		catch(Exception $e)
		{
			error_log($e->getMessage());
		}
		
	}

	function __soapcall($name, $args, $options = NULL, $input_headers = NULL, &$output_headers = NULL)
	{
		$result =  null;
		try{
			$fctExists = false;
			foreach($this->arrFonctions as $nameFct)
			{			
				//echo "<br/>$nameFct,$name".strpos($nameFct,$name."(");
				if(strpos($nameFct,$name."(") !== FALSE)
				{
					$fctExists = true;
					break;
				}
			}

			//Vérification si la fonction existe sinon FATAL
			if($fctExists){
				if($options == null) $options = $this->opts;
				
				$result = parent::__soapcall($name, $args, $options, $input_headers, $output_headers);
			}
			else{				
				error_log("Fonction WS $name inconnu ({$this->ws})");
			}
		}
		catch(Exception $e)
		{
			//error_log($e->getMessage());
		}
		return $result;
	}

	function __doRequest($request, $location, $action, $version, $oneWay = false)
	{		
		global $responsePrevious;
		try{
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
			if($dureeRqt > 1){
				error_log("{$this->ws} : Lente rqt : $requestOrigin ($dureeRqt sec)");
			}
		}
		catch(Exception $e)
		{
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
		if(isset($responsePrevious->faultstring))
		{
			return $responsePrevious->faultstring;
		}
		else if($responsePrevious == null)
		{
			return "Erreur de connexion";
		}
		return false;
	}
}
/**
 *
 * @global string $URL_API_CCS
 * @global type $g_LoginCCS
 * @global type $g_passwordCCS
 * @return array array is return when succes or int when error
 */
function ConnecteWS($user = "", $pass = "", $ws = "")
{
	global $URL_API_CCS,$g_useSoapClientV2;
	if ($user == "")
		$user = $_SESSION['id_test'];
	if ($pass == "")
		$pass = $_SESSION['mdp_test'];
	if ($ws == "")
		$ws = $_SESSION['urlWS'];

	$authentification = array("user" => $user, "pass_crypted" => $pass);
	$request = $authentification;

	if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("Users",  array("parameters" => $request));
		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
		$client = new nusoap_client($ws, true);
		$client->soap_defencoding = 'UTF-8';
		$client->decode_utf8 = false;
		$result = $client->call("Users", $request, "http://tempuri.org/IWSGandara/", "", false, false);		
	}

	$error = $client->getError();
	
	if ($error) {
		error_log($error);
		return $error;
	} else {
		return 1;
	}
}
function ConnexionGMAO($login = "", $pass_clear="", $ws="")
{
    global $URL_API_CCS, $g_useSoapClientV2;
    $request=array("login"=>$login,"pass_clear"=>$pass_clear);

    if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("GMAOConnexion",  array("parameters" => $request));
		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
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
		if($result["GMAOConnexionResult"])
        {
            return $result["GMAOConnexionResult"];
        }else{
            return "500";
        }
	}

}

function GetPrestationContrat($token, $dateDebut, $dateFin, $idSite, $ws)
{
	global $URL_API_CCS, $g_useSoapClientV2;
	$request = array("token"=>$token, "dateDebut" => $dateDebut, "dateFin"=> $dateFin, "IdSite"=> $idSite);

	if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("GMAOGetPrestationContrat",  array("parameters" => $request));

		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
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

		if(isset($result["GMAOGetPrestationContratResult"]["PrestationContrat"]))
        {
			return json_encode($result["GMAOGetPrestationContratResult"]["PrestationContrat"]);

        }else{
            return "500";
        }
	}
}




function GetDocumentPrestation($token, $IdDossierIntervention,$ws)
{
	global $URL_API_CCS, $g_useSoapClientV2;
	$request = array("token"=>$token, "IdDossierIntervention" => $IdDossierIntervention);

	if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("GMAOGetDocumentsPrestation",  array("parameters" => $request));

		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
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

		if(isset($result["GMAOGetDocumentsPrestationResult"]["KV"]))
        {
			return json_encode($result["GMAOGetDocumentsPrestationResult"]["KV"]);

        }else{
            return "500";
        }
	}
}

function File64($b64string = "", $fileName = "")
{


	$file = base64_decode($b64string);
	file_put_contents($fileName,$file);

	return ($fileName);
	
}

Function VoirDocument($fileName = "")
{
		
	$fileN = $fileName;

	header('Content-type: application/pdf');

	header('Content-Disposition: inline; filename="' . $fileN . '"');
	
	header('Content-Transfer-Encoding: binary');
	
	header('Accept-Ranges: bytes');


	flush(); // this doesn't really matter.
	$fp = fopen($fileName, "r");
	while (!feof($fp))
	{
		echo fread($fp, 65536);
		flush(); // this is essential for large downloads
	} 
	fclose($fp); 
	unlink($fileName);

}



Function TelechargerDocument($fileName)
{
	
	$fileN = $fileName;
	
	header("Content-Disposition: attachment; filename=" . urlencode($fileN));   
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header("Content-type: application/pdf"); 
	
	header('Content-Type: application/zip');


	header("Content-Description: File Transfer");            
	header("Content-Length: " . filesize($fileN));


	flush(); // this doesn't really matter.
	$fp = fopen($fileName, "r");
	while (!feof($fp))
	{
		echo fread($fp, 65536);
		flush(); // this is essential for large downloads
	} 
	fclose($fp); 
	unlink($fileName);

}



function DownloadZIP($arrayDocs, $fileName)
{

		$files = array();
	foreach ($arrayDocs as $value) {

		$files[] = File64($value[0], $value[1]);

	}

		$zipname = $fileName.".zip";
		$zip = new ZipArchive;
		$zip->open($zipname, ZipArchive::CREATE);
		foreach ($files as $file) {
		$zip->addFile($file);
		}
		$zip->close();
		
		foreach ($files as $file) {
			unlink($file);
		}

		echo($zipname);

}






function GetClientSiteContrat($token,$ws)
{
	global $URL_API_CCS, $g_useSoapClientV2;
	$request = array("token"=>$token);

	if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("GMAOGetClientSiteContrat",  array("parameters" => $request));

		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
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

		if(isset($result["GMAOGetClientSiteContratResult"]["ClientSiteContrat"]))
        {
			return json_encode($result["GMAOGetClientSiteContratResult"]["ClientSiteContrat"]);

        }else{
            return "500";
        }
	}
}






function GetListeTaches($token,$IdPrestationContrat,$ws)
{
	global $URL_API_CCS, $g_useSoapClientV2;
	$request = array("token"=>$token,"IdPrestationContrat" => $IdPrestationContrat);

	if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("GMAOGetListeTaches",  array("parameters" => $request));

		if (is_object($result)) {
			$result = json_decode(json_encode($result), true);
		}
	}
	else
	{
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

		if(isset($result["GMAOGetListeTachesResult"]["KV"]))
        {
			return json_encode($result["GMAOGetListeTachesResult"]["KV"]);

        }else{
            return "500";
        }
	}
}



function CallENDPOINT($url="",$endpoint="", )
{

    if($endpoint === "GMAOConnexion")
    {
        echo(ConnexionGMAO($_POST['login'],$_POST['pass_clear'],$url));
    }


	if($endpoint === "GMAOGetClientSiteContrat")
    {
        echo(GetClientSiteContrat($_POST['token'],$url));
    }


	if($endpoint === "GMAOGetPrestationContrat")
	{
		echo(GetPrestationContrat($_POST['token'], $_POST['dateDebut'],$_POST['dateFin'],$_POST['IdSite'],$url));
	}


	if($endpoint === "GMAOGetDocumentsPrestation")	
	{
		echo(GetDocumentPrestation($_POST['token'], $_POST['IdDossierIntervention'],$url));
	}


	if($endpoint === "GMAOFile64")
	{

		echo(File64($_POST['b64'],$_POST['filename']));

	}

	if($endpoint === "GMAOSeeDocument")
	{
		return VoirDocument($_GET['filename']);
	}

	if($endpoint === "GMAODownloadDocument")
	{
		return TelechargerDocument($_GET['filename']);
	}

	if($endpoint === "GMAOZIPDocs")
	{
		return DownloadZIP($_POST['arrayDocs'], $_POST['filename']);
	}

	if($endpoint === "GMAOGetListeTaches")
	{

		echo(GetListeTaches($_POST['token'],$_POST['IdPrestationContrat'],$url));
	}
		

}



    $url = "http://webservices.gandarasolution.fr:8039/WSGandara?wsdl";
    $terminaison = $_GET["endpoint"];
    $callToWS = CallENDPOINT($url, $terminaison);
    // echo($callToWS);
 


?>