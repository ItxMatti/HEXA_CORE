<?php
$python = 'python';
$script = __DIR__ . '/../python/image_generator_app.py';
$log = __DIR__ . '/../logs/image_generator.log';

$host = '127.0.0.1';
$port = 5001;
$timeoutSeconds = 15;

function isGeneratorRunning($host, $port) {
    $connection = @fsockopen($host, $port, $errno, $errstr, 1);
    if ($connection) {
        fclose($connection);
        return true;
    }
    return false;
}

if (!isGeneratorRunning($host, $port)) {
    $command = 'start /B "" "' . $python . '" "' . $script . '" > "' . $log . '" 2>&1';
    pclose(popen($command, 'r'));

    $startTime = time();
    while ((time() - $startTime) < $timeoutSeconds) {
        if (isGeneratorRunning($host, $port)) {
            break;
        }
        usleep(500000);
    }
}

header('Location: http://127.0.0.1:5001/');
exit;
