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
			//var_dump($this->arrFonctions);		
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




function ConnexionGMAO($login = "", $pass_clear="", $ws="")
{
    global $URL_API_CCS, $g_useSoapClientV2;
    $request=array("login"=>$login,"pass_clear"=>$pass_clear);

    if($g_useSoapClientV2)
	{
		$client = new MSSoapClient($ws, array('compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP));
		$result = $client->__soapCall("Connexion",  array("parameters" => $request));
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
		//var_dump($_SESSION);
		error_log($error);
        return "ERRREUR";
		return $error;
	} else {
		if($result["ConnexionResult"])
        {
            return $result["ConnexionResult"];
        }else{
            return "500";
        }
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
		//var_dump($_SESSION);
		error_log($error);
		return $error;
	} else {
		return 1;
	}
}


function CallENDPOINT($url="",$endpoint="", )
{
    if($endpoint === "Connexion")
    {
        return ConnexionGMAO($_POST['login'],$_POST['pass_clear'],$url);
    }
}

// $login = "-1";
// $pass_clear = "4ea9E9s+Bjdr4A7UtcRqUw==rr";
// // $callToWS = ConnecteWS($login, $pass_clear,"http://webservices.gandarasolution.fr:8039/WSGandara?wsdl");
// $callToWS = ConnexionGMAO("a@a.fr","Youforlife","http://webservices.gandarasolution.fr:8039/WSGandara?wsdl");




    $url = "http://webservices.gandarasolution.fr:8039/WSGandara?wsdl";
    $terminaison = $_GET["endpoint"];
    $callToWS = CallENDPOINT($url, $terminaison);
    echo($callToWS);


    


?>