define(function(require) {

  /**
   * Button that asks for confirmation, asking to click it a second time.
   * This View is intended to be attached to an existing button.
   *
   * This is a bit like a Marionette behaviour. Since I'm not using Marionette,
   * this is reinventing the wheel a bit. But I don't really care for now.
   *
  **/
  var ConfirmActionButtonView = Backbone.View.extend({
    events: {
      'click': '_handleClicked'
    },

    initialize: function() {
      this._clicked = false;
    },

    _handleClicked: function() {
      if (!this._clicked) {
        var previousHtml = this.$el.html();
        this._clicked = true;
        this.$el.text('Tiešām?');
        this._launchResetTimeout(previousHtml);
      } else {
        this._cancelResetTimeout();
        this.trigger('action');
      }
    },

    _launchResetTimeout: function(previousHtml) {
      this._timeout = setTimeout(function() {
        this._clicked = false;
        this.$el.html(previousHtml);
      }.bind(this), 5000);
    },
    _cancelResetTimeout: function() {
      clearTimeout(this._timeout);
    }
  });

  return ConfirmActionButtonView;

});
