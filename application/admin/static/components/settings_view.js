define(function(require) {

  var Settings = require('utils/settings');

  var SettingsItemView = Backbone.View.extend({
    tagName: 'p',

    template: _.template([
      '<label>',
        '<input type="checkbox" <% if (enabled) { %> checked <% } %> />',
        '<%- name %>',
      '</label> ',
    ].join(' ')),

    events: {
      'change input[type="checkbox"]': '_settingChanged'
    },

    initialize: function(options) {
      this.options = _.defaults(_.pick(options, 'key', 'name', 'enabled'), {
        name: '(bez nosaukuma)',
        enabled: false
      });

      this._timeout = null;
      this._timeoutf = null;
    },

    render: function() {
      var html = this.template(this.options);

      this.$el.html(html);

      return this;
    },

    _fadeOutTimeout: 1500,

    _settingChanged: function(e) {
      this.options.enabled = e.target.checked;
      Settings.set(this.options.key, this.options.enabled)
      .then(function() {
        if (this._timeout) {
          this._reschedule();
          return;
        }

        var $label = $('<span>')
          .addClass('label label-success')
          .text('Saglabāts!');
        $label.hide();
        this.$el.append($label);
        $label.fadeIn(200);
        this._timeoutf = function() {
          this._timeout = null;
          this._timeoutf = null;
          $label.fadeOut({
            duration: 200,
            done: function() { $label.remove(); }
          });
        }.bind(this)
        this._timeout = window.setTimeout(this._timeoutf, this._fadeOutTimeout);
      }.bind(this));
    },

    _reschedule: function() {
      window.clearTimeout(this._timeout);
      window.setTimeout(this._timeoutf, this._fadeOutTimeout);
    }
  });

  return {
    attach: function($target, settings) {
      $target.html('');
      _.forEach(settings, function(value, key) {
        var view = new SettingsItemView({
          key: key,
          name: Settings.Glossary[key],
          enabled: value
        });

        view.render();
        $target.append(view.el);
      });
    }
  }
});
