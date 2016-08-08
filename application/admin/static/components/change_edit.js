define(function(require) {
  var Change = require('models/change');
  var ChangePane = require('components/change_pane');

  var ChangeEditPaneView = Backbone.View.extend({
    template: [
      '<div class="row">',
        '<div class="col-md-3" id="change-pane"></div>',
      '</div>',
      '<p>',
        '<button class="btn btn-primary" data-do="save">',
          '<span class="glyphicon glyphicon-floppy-disk"></span>',
          'Saglabāt',
        '</button>',
      '</p>'
    ].join(' '),

    events: {
      'click button[data-do="save"]': '_save',
    },

    initialize: function(options) {
      if (!this.model) {
        this.model = new Change();
      }

      this.options = _.defaults(options, {
        fixedHeight: false
      });
    },

    render: function() {
      this.$el.html(this.template);

      this._pane = new ChangePane({
        model: this.model,
        el: this.$('#change-pane')[0],

        fixedHeight: this.options.fixedHeight,
        hideDate: false,
      }).render();

      return this;
    },

    _save: function(e) {
      var $btn = $(e.target);

      $btn.addClass('disabled');
      $btn.find('.glyphicon')
        .toggleClass('glyphicon-floppy-disk glyphicon-cog');

      this.model.once('sync', function() {
        window.location.assign('/admin/changes/' + this.model.get('id'));
      }.bind(this));
      this.model.save();
    }
  });

  return {
    attach: function($target, initialData, options) {
      var change = new Change(initialData);

      var view = new ChangeEditPaneView(_.defaults({
        model: change,
        el: $target[0]
      }, options)).render();
    }
  }
});
