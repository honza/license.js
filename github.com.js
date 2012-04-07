// License.js - detect a project's open source license (Github)
// - This is a plugin for dotjs https://github.com/defunkt/dotjs.
//
// Copyright (c) 2012, Honza Pokorny
// License.js may be freely distributed under the BSD license.
// https://github.com/honza/license.js

(function() {

  var root = this;

  var getProjectRootUrl, showLicense, licenseFilenames, findLicenseFile,
  knownLicenses, detect;

  licenseFilenames = [
    'LICENSE',
    'LICENSE.md',
    'LICENSE.markdown',
    'COPYING',
    'COPYING.md',
    'COPYING.markdown',
    'README',
    'README.md',
    'README.markdown',
    'README.rst'
  ];

  knownLicenses = [
    {
      name: 'MIT',
      pattern: 'Permission is hereby granted, free of charge, to any person'
    },
    {
      name: 'BSD',
      pattern: "Redistribution and use in source and binary forms, " +
          "with or without modification, are permitted provided that the " +
          "following conditions are met"
    },
    {
      name: 'GPL',
      pattern: 'GNU GENERAL PUBLIC LICENSE'
    }
  ];

  getProjectRootUrl = function() {
    var currentPathName, parts;

    currentPathName = window.location.pathname;
    parts = currentPathName.split('/');

    if (parts.length > 2) {
      return parts.slice(0, 3).join('/');
    } else {
      return null;
    }
  };

  findLicenseFile = function(url, callback) {
    // https://raw.github.com/honza/heroku-sprunge/master/LICENSE
    var licenseUrl;

    for (var i = 0; i < licenseFilenames.length; i++) {
      licenseUrl = 'https://raw.github.com' + url + '/master/' +
        licenseFilenames[i];
      $.get(licenseUrl, function(data) {
        if (data) {
          callback(data);
        }
      });
    }

  };

  detect = function(text, license) {
    text = text.replace(/\n/gi, ' ');
    var matches = text.match(license.pattern);
    if (matches === null) {
      matches = text.match(/ + license.name + /);
      if (matches === null) {
        return false;
      }
    }
    return true;
  };

  showLicense = function(callback) {
    var projectUrl = getProjectRootUrl();
    var licenseFile = findLicenseFile(projectUrl, function(licenseText) {
      var match;
      for (var i = 0; i < knownLicenses.length; i++) {
        match = detect(licenseText, knownLicenses[i]);
        if (match) {
          callback(knownLicenses[i].name);
          break;
        }
      }
      callback(null);
    });
  };

  $(function() {
    showLicense(function(licenseName) {
      if (licenseName) {
        console.log('This project uses the following license: ' + licenseName);           
        $('#repository_description').append('<p>' + licenseName + ' license</p>');
      }
    });
  });

}).call(this);
