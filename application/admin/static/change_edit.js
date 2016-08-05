define(function(require) {
  var Change = require('change');
  var ChangePane = require('change_pane');

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

    initialize: function() {
      if (!this.model) {
        this.model = new Change();
      }
    },

    render: function() {
      this.$el.html(this.template);

      this._pane = new ChangePane({
        model: this.model,
        el: this.$('#change-pane')[0],

        hideDate: false,
      }).render();

      return this;
    },

    _save: function(e) {
      var $btn = $(e.target);

      $btn.addClass('disabled');
      $btn.find('.glyphicon')
        .toggleClass('glyphicon-floppy-disk glyphicon-cog');

      this.model.save({
        success: function() {
          window.location.assign('/admin/changes/' + this.model.get('id'));
        }
      });
    }
  });

  return {
    attach: function($target, initialData) {
      var change = new Change(initialData);

      var view = new ChangeEditPaneView({
        model: change,
        el: $target[0]
      }).render();
    }
  }
});
