<?php

$shortopts = "";

$longopts = array(
    "init:",
    "install::",
    "destroy::"
);

$options = getopt($shortopts, $longopts);

$config_json = file_get_contents("js_plugin_init_config.json");

$config = json_decode($config_json, true);


if (isset($options['init'])) {
    $config['project_name'] = $options['init'];

    create_project_folder($config);

} else if ($config['project_name'] != null) {
    if (isset($options['install'])) {

        if (!required_fields_validation($config)) {
            echo 'Fill required config properties' . "\r\n";
            return;
        }

        create_main_js_file($config);

        create_webpack_file($config);

        create_core_package_json($config);

        create_readme_file($config);

        create_gitignore($config);


        switch ($config['plugin_type']) {
            case 'canvas':
                create_canvas_test_folder($config);
                break;

            case 'vanilla':
                create_vanilla_test_folder($config);
                break;

            default:
                create_default_test_folder($config);
                break;
        }


        if (isset($options['destroy'])) {
            remove_init_files();
            git_init($config);
        }
    } else if (isset($options['destroy'])) {
        remove_init_files();
        git_init($config);
    }
}

function required_fields_validation($config)
{

    if ($config['project_class'] == null) {
        echo 'project_class is required property' . "\r\n";
        return false;
    }

    if ($config['jquery_function_name'] == null) {
        echo 'jquery_function_name is required property' . "\r\n";
        return false;
    }

    if ($config['project_name_underscore'] == null) {
        echo 'project_name_underscore is required property' . "\r\n";
        return false;
    }

    if ($config['project_description'] == null) {
        echo 'project_description is required property' . "\r\n";
        return false;
    }

    if (empty($config['project_keywords'])) {
        echo 'project_keywords is required property' . "\r\n";
        return false;
    }

    return true;
}

function create_default_test_folder($config)
{
    create_test_package_json($config);

    create_folder('test/imgs');
    create_folder('test/sass');

    system('cp -r js_plugin_init_src/default_project/test/imgs ' . 'test');
    system('cp -r js_plugin_init_src/default_project/test/sass ' . 'test');

    system('cp js_plugin_init_src/default_project/test/webpack.config.js ' . 'test');
    system('cp js_plugin_init_src/default_project/test/index.es6 ' . 'test');


    $search_fields = array(
        '{PROJECT_NAME}',
        '{PROJECT_DESCRIPTION}',
        '{PROJECT_KEYWORDS}'
    );

    $replace_with = array(
        $config['project_name'],
        $config['project_description'],
        implode(" ", $config['project_keywords'])
    );


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/default_project/test/index.html",
        'create_file' => 'test/index.html',
        'search_field' => $search_fields,
        'replace_field' => $replace_with
    ));

    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/default_project/test/index.es6",
        'create_file' => 'test/index.es6',
        'search_field' => array(
            '{PLUGIN_SLUG_UNDERSCORE}',
            '{PROJECT_NAME_DASHED}',
            '{JQUERY_FUNCTION_NAME}'
        ),
        'replace_field' => array(
            $config['project_name_underscore'],
            $config['project_name_dashed'],
            $config['jquery_function_name']
        )
    ));
}

function create_canvas_test_folder($config)
{
    create_test_package_json($config);

    create_folder('test/sass');

    system('cp -r js_plugin_init_src/canvas_project/test/sass ' . 'test');

    system('cp js_plugin_init_src/default_project/test/webpack.config.js ' . 'test');


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/canvas_project/test/index.es6",
        'create_file' => 'test/index.es6',
        'search_field' => array(
            '{PLUGIN_SLUG_UNDERSCORE}',
            '{PROJECT_NAME_DASHED}',
            '{JQUERY_FUNCTION_NAME}'
        ),
        'replace_field' => array(
            $config['project_name_underscore'],
            $config['project_name_dashed'],
            $config['jquery_function_name']
        )
    ));


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/canvas_project/test/index.html",
        'create_file' => 'test/index.html',
        'search_field' => array(
            '{PROJECT_NAME}',
            '{PROJECT_DESCRIPTION}',
            '{PROJECT_KEYWORDS}',
            '{PROJECT_SLUG_DASHED}'
        ),
        'replace_field' => array(
            $config['project_name'],
            $config['project_description'],
            implode(" ", $config['project_keywords']),
            $config['project_name_dashed'],
        )
    ));
}


function create_vanilla_test_folder($config)
{
    create_test_package_json($config);

    create_folder('test/sass');

    system('cp -r js_plugin_init_src/vanilla_project/test/sass ' . 'test');

    system('cp js_plugin_init_src/default_project/test/webpack.config.js ' . 'test');


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/vanilla_project/test/index.es6",
        'create_file' => 'test/index.es6',
        'search_field' => array(
            '{PLUGIN_CLASS}'
        ),
        'replace_field' => array(
            $config['project_class']
        )
    ));


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/vanilla_project/test/index.html",
        'create_file' => 'test/index.html',
        'search_field' => array(
            '{PROJECT_NAME}',
            '{PROJECT_DESCRIPTION}',
            '{PROJECT_KEYWORDS}',
        ),
        'replace_field' => array(
            $config['project_name'],
            $config['project_description'],
            implode(" ", $config['project_keywords']),
        )
    ));
}

function create_readme_file($config)
{
    $search_fields = array(
        '{PROJECT_NAME}'
    );

    $replace_with = array(
        $config['project_name']
    );


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/default_project/core/README.md",
        'create_file' => 'README.md',
        'search_field' => $search_fields,
        'replace_field' => $replace_with
    ));

}


function create_core_package_json($config)
{

    switch ($config['plugin_type']) {
//        case 'vanilla':
//            $package_json = file_get_contents("js_plugin_init_src/vanilla_project/core/package.json");
//            break;

        default:
            $package_json = file_get_contents("js_plugin_init_src/default_project/core/package.json");
            break;
    }

    $package_config = json_decode($package_json, true);

    $package_config['name'] = $config['project_name'];
    $package_config['description'] = $config['project_description'];
    $package_config['main'] = 'build/' . $config['project_name'] . '.js';
    $package_config['keywords'] = $config['project_keywords'];
    $package_config['repository']['url'] = $config['github_url'] . '/' . $config['project_name'];

    //create config file
    $fp = fopen('package.json', 'w');
    fwrite($fp, json_encode($package_config, JSON_PRETTY_PRINT));
    fclose($fp);

}


function create_test_package_json($config)
{

    $package_json = file_get_contents("js_plugin_init_src/default_project/test/package.json");

    $package_config = json_decode($package_json, true);

    $package_config['name'] = $config['project_name'] . '_test';
    $package_config['description'] = $config['project_description'];
    $package_config['main'] = 'build/' . $config['project_name'] . '.js';
    $package_config['keywords'] = $config['project_keywords'];
    $package_config['repository']['url'] = $config['github_url'] . '/' . $config['project_name'];

    //create config file
    create_folder('test');

    $fp = fopen('test/package.json', 'w');
    fwrite($fp, json_encode($package_config, JSON_PRETTY_PRINT));
    fclose($fp);

}


function create_main_js_file($config)
{

    $sample_file = "js_plugin_init_src/default_project/core/plugin.es6";

    if ($config["plugin_type"] == "canvas") {
        $sample_file = "js_plugin_init_src/canvas_project/core/plugin.es6";
    }

    else if ($config["plugin_type"] == "vanilla") {
        $sample_file = "js_plugin_init_src/vanilla_project/core/plugin.es6";
    }


    $search_fields = array(
        '{CLASS_NAME}',
        '{JQUERY_FUNCTION_NAME}',
        '{FUNCTION_NAME_UNDERSCORE}',
        '{REPO_URL}',
        '{PROJECT_NAME_DASHED}'
    );

    $replace_with = array(
        $config['project_class'],
        $config['jquery_function_name'],
        $config['project_name_underscore'],
        'https://github.com/lemehovskiy/' . $config['project_name'],
        $config['project_name_dashed']
    );


    create_file_by_sample(array(
        'sample_file' => $sample_file,
        'create_file' => 'src/' . $config['project_name'] . '.es6',
        'search_field' => $search_fields,
        'replace_field' => $replace_with
    ));

}

function create_webpack_file($config)
{
    $search_fields = array(
        '{PROJECT_NAME}'
    );

    $replace_with = array(
        $config['project_name']
    );


    create_file_by_sample(array(
        'sample_file' => "js_plugin_init_src/default_project/core/webpack.config.js",
        'create_file' => 'webpack.config.js',
        'search_field' => $search_fields,
        'replace_field' => $replace_with
    ));

}

function create_file_by_sample($settings)
{

    $dirname = dirname($settings['create_file']);

    if (!is_dir($dirname)) {
        mkdir($dirname, 0755, true);
    }

    $sample_file = file_get_contents($settings['sample_file']);

    $sample_file_replaced_fields = str_replace($settings['search_field'], $settings['replace_field'], $sample_file);

    $create_file = fopen($settings['create_file'], 'w');
    fwrite($create_file, $sample_file_replaced_fields);

}


function create_folder($path)
{
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }
}


function git_init($config)
{
    system('git init');
    system('git add .');
    system('git commit -m "init"');
    system('git remote add origin '. $config['github_url'] .'/'. $config['project_name_underscore'] .'.git');
}


function create_gitignore($config)
{

    $gitignore_string = "";

    $rules_counter = 0;

    foreach ($config['gitignore'] as $rule) {

        if ($rules_counter++ == 0) {
            $gitignore_string .= $rule;
        } else {
            $gitignore_string .= "\n" . $rule;
        }

    }

    //create config file
    $fp = fopen(".gitignore", 'w');
    fwrite($fp, $gitignore_string);
    fclose($fp);
}


function remove_files($files)
{
    foreach ($files as $file) {
        system('rm -rf ' . $file);
    }
}


function create_project_folder($config)
{

    $path = '../' . $config['project_name'];

    if (is_dir($path)) {
        throw new \RuntimeException(sprintf('Unable to create the %s directory', $path));
    } else {

        //create project folder
        system('mkdir -p ' . $path);

        //create config file
        $fp = fopen($path . '/js_plugin_init_config.json', 'w');
        fwrite($fp, json_encode($config, JSON_PRETTY_PRINT));
        fclose($fp);

        //copy src files
        system('cp -r js_plugin_init_src ' . $path);

        //copy init file
        system('cp -r js_plugin_init.php ' . $path);


        echo 'Successfully init' . "\r\n";
    }

}

function remove_init_files()
{
    remove_files(array(
        'js_plugin_init.php',
        'js_plugin_init_src',
        'js_plugin_init_config.json'
    ));
}