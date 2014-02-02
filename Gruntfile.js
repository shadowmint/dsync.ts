module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-ts');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8089,
                    base: './'
                }
            }
        },
        clean: {
            lib: {
                src: ['bin/*.js.map', 'bin/*.js']
            },
            example: {
                src: ['example/*.js.map', 'example/*.js']
            }
        },
        ts: {
            lib: {
                src: ['src/**/*.ts'],
                out: 'bin/dsync.js',
                options: {
                    target: 'es3',
                    sourceMaps: false,
                    declaration: true,
                    removeComments: false
                }
            },
            example: {
                src: ['example/*.ts'],
                out: 'example/example.js',
                options: {
                    target: 'es3',
                    sourceMaps: false,
                    declaration: false,
                    removeComments: false
                }
            },
            tests: {
                src: ['tests/__init__.ts'],
                out: 'example/tests.js',
                options: {
                    target: 'es3',
                    sourceMaps: false,
                    declaration: false,
                    removeComments: false
                }
            }
        },
        exec: {
            tests: {
                command: 'node example/tests.js',
                stdout: true,
                stderr: true
            }
        },
        watch: {
            example: {
                files: ['example/*.ts', '!example/*.d.ts'],
                tasks: ['ts:example']
            },
            tests: {
                files: ['src/**/*.ts', 'tests/**/*.ts'],
                tasks: ['ts:lib', 'ts:tests', 'exec:tests']
            }
        },
        open: {
            dev: {
                path: 'http://localhost:8089/example/index.html'
            }
        }
    });

    grunt.registerTask('default', ['clean', 'ts:lib']);
    grunt.registerTask('dev', ['clean', 'ts', 'exec:tests', 'connect', 'open', 'watch']);
    grunt.registerTask('test', ['clean', 'ts:lib', 'ts:tests', 'exec:tests']);
}
