module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
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
    ts: {
      lib: {
        src: ['../*.ts'],
        out: 'dsync.js',
        options: {
          target: 'es3',
          sourceMaps: false,
          declaration: true,
          removeComments: false
        }
      },
      example: {
        src: ['*.ts'],
        out: 'example.js',
        options: {
          target: 'es3',
          sourceMaps: false,
          declaration: false,
          removeComments: false
        }
      }
    },
    watch: {
      lib: {
        files: '../*.ts',
        tasks: ['ts:lib', 'ts:example']
      },
      example: {
        files: ['*.ts', '!*.d.ts'],
        tasks: ['ts:example']
      }
    },
    open: {
      dev: {
        path: 'http://localhost:8089/index.html'
      }
    }
  });

  grunt.registerTask('default', ['ts', 'connect', 'open', 'watch']);
}
