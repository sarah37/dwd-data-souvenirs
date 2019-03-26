<?php

require 'keys.php';

if (isset($_POST['query'])) {
	//Search box value assigning to $Name variable.
	$query1 = $_POST['query'];
}

$query      = '/events?'.$query1.'&key='.$api_key;
$signature  = hash_hmac('sha1', $query, $secret_key);
$url        = 'https://api.edinburghfestivalcity.com'.$query.'&signature='.$signature;

$result = file_get_contents($url);

echo $result;
?>