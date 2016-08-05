define(function(require) {

  var Change = require('models/change');

  var ConfirmActionButton = require('components/confirm_action_button');

  var ChangeListItemView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);

      var cab = new ConfirmActionButton({
        el: this.$el.find('button[data-do="delete"]') });
      this.listenTo(cab, 'action', this._delete);
    },

    render: function() {
      // Since we only rehydrate server-rendered views with a couple of events,
      // this removes cosmetics which signal that the view is not rendered.
      // We don't really perform any replacement of elements.
      this.$el.find('button.disabled').removeClass('disabled');

      return this;
    },

    _delete: function() {
      this.model.destroy();
    }
  });

  return {
    attach: function($target, dataItems) {
      _.forEach(dataItems, function(item) {
        var change = new Change(item);

        var $el = $target.find('[data-id="' + item.id + '"]');

        var view = new ChangeListItemView({
          el: $el[0],
          model: change
        }).render();
      });
    }
  }

});
