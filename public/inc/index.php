<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
$url = "http://localhost/" . $_POST['url'];
$datos = $_POST['data'];
$method = $_POST['method'] ? $_POST['method'] : 'POST';
$data = array('importarhtml' => $datos);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => $method,
        'content' => http_build_query($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if (!$result) {
	// echo 'Error' . PHP_EOL;
	var_dump($result);
}else{ 
	print_r($result); 
}