define(function(require) {

  var DEFAULTS = {
    cozyMode: false,
    fixedHeight: false
  }

  var GLOSSARY = {
    cozyMode: 'Kompaktā platuma režīms',
    fixedHeight: 'Vienmēr rādīt 8 stundu lodziņus izmaiņu ievadei'
  }

  var LS = window.localStorage;
  function LSget(name) {
    return JSON.parse(LS.getItem(name));
  }
  function LSset(name, value) {
    try {
      LS.setItem(name, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  var Settings = {
    get: function(name) {
      return new Promise(function(resolve) {
        resolve(LSget(name));
      });
    },

    set: function(name, value) {
      return new Promise(function(resolve, reject) {
        var res = LSset(name, value);
        if (res) resolve();
        else reject();
      });
    },

    // The below method is method-agnostic, whereas the above methods are
    // currently locked down to LocalStorage.
    // There's a reason the whole Settings façade is abstracted behind promises,
    // it's for future compatibility with other settings backends.
    getAll: function() {
      var settings = { };
      var promises = [ ];
      _.forEach(DEFAULTS, function(value, key) {
        promises.push(
          Settings.get(key)
          .then(function(value) {
            settings[key] = value;
          })
        );
      });
      return Promise.all(promises)
      .then(function() { return settings; });
    },

    Defaults: DEFAULTS,
    Glossary: GLOSSARY
  }

  // Settings.init()
  if (!LSget('EDAEMON_SETTINGS_SCHEMA')) {
    Settings.set('EDAEMON_SETTINGS_SCHEMA', 1);
    _.forEach(DEFAULTS, function(value, key) {
      Settings.set(key, value);
    });
  }

  return Settings;

});
