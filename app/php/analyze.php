<?php
$url = 'https://api.textrazor.com/';
$text = ($_GET['corpus']);
$data = array('text' => $text, 'extractors' => 'topics,entities');

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => ["Content-type: application/x-www-form-urlencoded", "X-TextRazor-Key: 357de7a0c99d16aee1b7723af6954ee0b207c2a2611e3cb9da505000"],
        'method'  => 'POST',
        'content' => http_build_query($data),
    ),
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo($result);

?>