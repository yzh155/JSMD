/*
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    //load required grunt plugins
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
	jshint: {
	    all: [
		'Gruntfile.js',
		'build/js/base.js'
	    ],
	    options: {
		jshintrc: '.jshintrc',
	    },
	},
	
	copy: {	    
	    assets: {
		cwd: 'assets',
		src: ['**'],
		dest: 'build/assets',
		expand: true
	    },
	    
	    htmldev: {
		    cwd: 'html',
		    src: [ '**/*.html'],
		    dest: 'build',
		    expand: true
		},
	    htmlprod: {
		cwd: 'html',
		src: [ '**/*.html' ],
		dest: 'build',
		expand: true,
		options: {
		    process: function (content, srcpath) {
			//minify the javascript
			return content.replace(/"js\/base.js"/g,'"js/base.min.js"');
		    }		    
		}	    
	    },
	    vendor: {
		cwd: 'vendor',
		src: [ '**/*.js' ],
		dest: 'build/js',
		expand: true
	    }

	},

	// Before generating any new files, remove any previously-created files.
	clean: {
	    test: ['tmp'],
	    build: ['build']
	},
	
	// Configuration to be run (and then tested).
	init_JSMD: {
	    default_options: {
		options: {
		},
		files: {
		    'tmp/default_options': ['test/fixtures/testing'],
		},
	    }
	},
	
	//html hints
	htmlhint: {
	    build: {
		options: {
		    'tag-pair': true,
		    'tagname-lowercase': true,
		    'attr-lowercase': true,
		    'attr-value-double-quotes': true,
		    'doctype-first': true,
		    'spec-char-escape': true,
		    'id-unique': true,
		    'head-script-disabled': true,
		    'style-disabled': true
		},
		src: ['index.html']
	    }
	},

	//watch mode
	watch: {
	    html: {
		files: ['html/**/*.html'],
		tasks: ['html-dev']
	    },
	    js: {
		files: ['js/**/*.js'],
		tasks: ['js-dev']
	    },
	    cass: {
		files: ['assets/css/**/*.less'],
		tasks: ['less:dev']
	    }
	    
	},

	concat: {
	    build: {
		src: ['js/header.js', 'js/**/JSMD-*.js'],
		dest: 'build/js/base.js'
	    }
	},
	
	//put together the js
	uglify: {
	    prod: {
		files: {
		    'build/js/base.min.js': ['build/js/base.js']
		}
	    }
	},

	//put together CSS
	less: {
	    dev: {
		options: {
		    paths: ["assets/css"]
		},
		files: {
		    "build/css/main.css": "assets/css/main.less"
		}
	    },
	    prod: {
		options: {
		    paths: ["assets/css"],
		    cleancss: true,
		    modifyVars: {
			imgPath: '"http://mycdn.com/path/to/images"',
			bgColor: 'red'
		    }
		},
		files: {
		    "build/css/main.css": "assets/css/main.less"
		}
	    }
	},

	shell: {
            target: {
		//		command: 'rsync -r build/ awhite38@Enterprise.seas.rochester.edu:~/html'
		command: 'rsync -r build/ andrewwh@andrew-white.com:~/public_html/white_lab/Apps/JSMD'
            }
	},
	
	//host the code
	connect: {
	    server: {
		options: {
		    port: 4000,
		    base: 'build',
		    hostname: '*'
		}
	    }
	}
    });
    
    grunt.registerTask('js-dev', ['concat', 'jshint', 'copy:vendor']);
    grunt.registerTask('js-prod', ['concat', 'uglify', 'copy:vendor']);
    grunt.registerTask('html-dev', ['htmlhint', 'copy:htmldev', 'copy:assets']); 
    grunt.registerTask('html-prod', ['copy:htmlprod', 'copy:assets']); 
    grunt.registerTask('default', ['clean:build', 'js-dev', 'html-dev', 'less:dev', 'connect', 'watch']);
    grunt.registerTask('production', ['clean:build', 'js-prod', 'html-prod','less:dev', 'shell']);
    
};
