<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '245828876-RoOTZnEGpnbQivqSqX3bzmoWL8pgNWOwDV45ICEv';
$oauth_access_token_secret = 'TdauMr7bGqGRxRFyaQ3ZitfcbJ8gNE5GmwpXoyc9SoPQM';
$consumer_key = 'TndpKFZMC6nVQCfcVr4HrULuC';
$consumer_secret = 'jMfpP40oqMqlUxEqsp5Y1dLPZzNq7zFTc4vHrycYP8yuq3GwUX';
//$user_id = '78884300';
$screen_name = 'richgilbank';
$count = 200;
$retweets = false;

$twitter_url = 'statuses/user_timeline.json';
//$twitter_url .= '?user_id=' . $user_id;
$twitter_url .= '?screen_name=' . $screen_name;
$twitter_url .= '&include_rts=' . $retweets;
$twitter_url .= '&count=' . $count;

// Create a Twitter Proxy object from our twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
	$oauth_access_token,			// 'Access token' on https://apps.twitter.com
	$oauth_access_token_secret,		// 'Access token secret' on https://apps.twitter.com
	$consumer_key,					// 'API key' on https://apps.twitter.com
	$consumer_secret,				// 'API secret' on https://apps.twitter.com
	//$user_id,						// User id (http://gettwitterid.com/)
	$screen_name,					// Twitter handle
	$count,							// The number of tweets to pull out
	$retweets
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);

echo $tweets;

?>