const settings = {
  /**
   * The channel name where the widget is associated.
   * @type {String}
   */
  channel: "realjameskii",

  /**
   * The minimum amount of emotes for showing the combo.
   * @type {Number}
   */
  threshold: 3,

  /**
   * The widget alignement ("left", "center", "right").
   * @type {String}
   */
  alignment: "center",

  /**
   * The font used by the widget.
   * @type {Object}
   */
  font: {
    /**
     * The font provider ("local", "google").
     * @type {String}
     */
    provider: "google",

    /**
     * The font family.
     * @type {String}
     */
    family: "Roboto",
  },

  /**
   * The users excluded from the combo counter (must be in lower case).
   * @type {Array<String>}
   */
  excludedUsers: [],
};
