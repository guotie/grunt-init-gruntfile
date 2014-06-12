/*
 * grunt-init-gruntfile
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a basic Gruntfile.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'This template tries to guess file and directory paths, but ' +
    'you will most likely need to edit the generated Gruntfile.js file before ' +
    'running grunt. _If you run grunt after generating the Gruntfile, and ' +
    'it exits with errors, edit the file!_';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

    init.process({}, [
        // Prompt for these values.
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version'),
        init.prompt('title'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    ], function(err, props) {
        props.dom = /y/i.test(props.dom);
        props.min_concat = true;
        props.less = true;
        props.package_json = true;
        props.test_task = props.dom ? 'karma' : 'mocha';
        props.file_name = '<%= pkg.name %>';


        // Find the first `preferred` item existing in `arr`.

        function prefer(arr, preferred) {
            for (var i = 0; i < preferred.length; i++) {
                if (arr.indexOf(preferred[i]) !== -1) {
                    return preferred[i];
                }
            }
            return preferred[0];
        }

        // Guess at some directories, if they exist.
        var dirs = grunt.file.expand({
            filter: 'isDirectory'
        }, '*').map(function(d) {
            return d.slice(0, -1);
        });
        console.log("dirs:", dirs);
        props.lib_dir = prefer(dirs, ['lib', 'src', 'app']);
        props.test_dir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

        console.log(props);
        // Maybe this should be extended to support more libraries. Patches welcome!
        props.jquery = grunt.file.expand({
            filter: 'isFile'
        }, '**/jquery*.js').length > 0;

        // Files to copy (and process).
        var files = init.filesToCopy(props);
        console.log("files:", files)

        // Actually copy (and process) files.
        init.copyAndProcess(files, props);

        // If is package_json true, generate package.json
        var devDependencies = {
            'grunt': '~0.4.2',
            'grunt-contrib-jshint': '~0.7.2',
            "grunt-contrib-concat": "~0.3.0",
            "grunt-contrib-connect": "^0.8.0",
            "grunt-contrib-copy": "^0.5.0",
            "grunt-contrib-jasmine": "^0.6.5",
            "grunt-contrib-less": "^0.11.1",
            "grunt-contrib-uglify": "~0.2.7",
            "grunt-contrib-watch": "~0.5.3"
        };

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', {
            name: props.name,
            description: props.description,
            version: props.version,
            node_version: '>= 0.10.0',
            title: props.title,
            devDependencies: devDependencies
        });
        // generate bower.json
        init.writePackageJSON('bower.json', {
            name: props.name,
            description: props.description,
            version: props.version,
            title: props.title,
            devDependencies: {
                "bootstrap": "~3.1.1",
                "vue": "~0.10.5",
                "grunt": "~0.4.5"
            }
        });


        // All done!
        done();
    });

};
