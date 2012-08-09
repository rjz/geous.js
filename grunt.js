module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      'geous.js': [
        'src/geous.js',
        'src/geocoders/google.js',
        'plugins/geous.maps.js',
        'plugins/jquery.geousable.js'
      ]
    }
  });

  grunt.registerTask('default','concat');
};
