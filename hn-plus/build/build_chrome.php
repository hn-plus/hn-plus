<?php
date_default_timezone_set('UTC');

define('HEADER', '/*! Example v1.0.0 | (c) ' . date('Y') . ' Example, Inc. | example.com/license */' . "\n");

function normalize($s) {
    // Normalize line endings
    // Convert all line-endings to UNIX format
    $s = str_replace("\r\n", "\n", $s);
    $s = str_replace("\r", "\n", $s);
    // Don't allow out-of-control blank lines
    $s = preg_replace("/\n{2,}/", "\n\n", $s);
    return $s;
}

function compress_javascript_file($filepath_in, $filepath_out) {
    $str = file_get_contents($filepath_in);
    $str = normalize($str);
    $lines = explode("\n", $str);
    $data = array();
    $inside_comment = false;

    // Replace variables
    $find_and_replace = array(
        // '{{ HTTP_HOST }}' => 'www.example.com',
    );

    $find = array_keys($find_and_replace);
    $replace = array_values($find_and_replace);

    foreach ($lines as $line) {
        if (empty($line)) {
            continue;
        }

        // keep requested lines
        $keep_str = ' // +';
        if (substr($line, -1 * strlen($keep_str)) === $keep_str) {
            $line = rtrim(substr($line, 0, -1 * strlen($keep_str)));
            $data[] = $line;
            continue;
        }

        // remove lines with console debugging
        $log_types = implode('|', array(
            'log',
            'debug',
            'info',
            'warn',
            'error',
            'assert',
            'clear',
            'dir',
            'dirxml',
            'trace',
            'group',
            'groupCollapsed',
            'groupEnd',
            'time',
            'timeEnd',
            'timeStamp',
            'profile',
            'profileEnd',
            'count',
            'exception',
            'table',
        ));
        $pattern = '/^(?:\s)+?console.(?:' . $log_types . ')\(/';
        if (preg_match($pattern, $line, $matches)) {
            //var_dump($matches);
            continue;
        }

        // remove comment lines
        $pattern = '/^(?:\s)+?\/\/.*/';
        if (preg_match($pattern, $line, $matches)) {
            //var_dump($matches);
            continue;
        }

        if (!$inside_comment) {
            if (!(false === strpos($line, '/*'))) {
                $inside_comment = true;
                continue;
            }
        }
        else {
            if (!(false === strpos($line, '*/'))) {
                $inside_comment = false;
            }

            continue;
        }

        // remove requested lines
        $remove_str = ' // -';
        if (substr($line, -1 * strlen($remove_str)) === $remove_str) {
            continue;
        }

        $line = str_replace($find, $replace, $line);

        $data[] = $line;
    }

    $data = implode("\n", $data);

    $data = HEADER . $data;

    return file_put_contents($filepath_out, $data);
}


function compress_css_file($filepath_in, $filepath_out) {
    $str = file_get_contents($filepath_in);
    $str = normalize($str);
    $lines = explode("\n", $str);
    $data = array();
    $inside_selector = false;
    foreach ($lines as $line) {
        $line = rtrim($line);

        if (empty($line)) {
            continue;
        }

        // remove comment lines
        if (substr(ltrim($line), 0, 2) === '/*' &&
            substr(rtrim($line), -2)   === '*/') {
            continue;
        }

        // allow up to 1 indentation
        if (!$inside_selector) {
            if (!(false === strpos($line, '{'))) {
                $inside_selector = true;
                $line = trim($line);
                $data[] = $line;
                continue;
            }
        }
        else {
            if (!(false === strpos($line, '}'))) {
                $inside_selector = false;
                $line = trim($line);
                $data[] = $line;
                continue;
            }
        }

        if ($inside_selector) {
            $line = preg_replace('/(\ {4})+/', '    ', $line);
        }

        /*
        // keep requested lines
        $keep_str = ' // +';
        if (substr($line, -1 * strlen($keep_str)) === $keep_str) {
            $line = rtrim(substr($line, 0, -1 * strlen($keep_str)));
            $data[] = $line;
            continue;
        }

        // remove requested lines
        $remove_str = ' // -';
        if (substr($line, -1 * strlen($remove_str)) === $remove_str) {
            continue;
        }
        */

        $data[] = $line;
    }

    // Combine lines
    $data = implode("\n", $data);

    // Add header
    $data = HEADER . $data;

    return file_put_contents($filepath_out, $data);
}

function run_command($command, $return_output=false) {
    if (!($return_output === false)) {
        $return_output = true;
    }

    // we also want stderr
    $command .= ' 2>&1';

    $exec = exec($command, $output, $return_var);

    $output_lines = array();

    if (!empty($output)) {
        foreach ($output as $line) {
            $line = htmlentities($line, ENT_QUOTES, 'UTF-8');

            if (!$return_output) {
                echo $line . "\n";
            }

            $output_lines[] = $line;
        }
    }

    if ($return_output) {
        return $output_lines;
    }

    return $return_var;
}

// Compile scss to css
run_command(
    'sass' .
    ' --unix-newlines' .
    ' --style expanded' .
    ' --no-cache' .
    ' "../src/chrome/css/content.scss"' .
    ' "/tmp/content.css"');

// Compress resulting css
$bytes = compress_css_file('/tmp/content.css', '../built/chrome/hn-comment-folding/1.0.0_0/css/content.css');
echo 'css bytes: ' . $bytes . "\n";

// Compress JavaScript files
$javascript_files = array(
    // source -> destination
    '../src/chrome/js/background.js' => '../built/chrome/hn-comment-folding/1.0.0_0/js/background.js',
    '../src/chrome/js/content.js'    => '../built/chrome/hn-comment-folding/1.0.0_0/js/content.js',
);
foreach ($javascript_files as $source => $destination) {
    $bytes = compress_javascript_file($source, $destination);
    echo ' js bytes: ' . $bytes . "\n";
}

// Copy files
copy('../src/chrome/manifest.json',   '../built/chrome/hn-comment-folding/1.0.0_0/manifest.json');
