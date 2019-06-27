(function($) {
  "use strict";
  let ModuleName = "banner";

  let Module = function(ele, options) {
    this.ele = ele;
    this.$ele = $(ele);
    this.option = options;
  };

  Module.DEFAULTS = {
    openAtStart: true, // [boolean] true | false
    // 設定啟動後是否要自動開或合，若設為false，就不要自勳開合；若為true是馬上自動開合；若為數字是幾毫秒之後開合
    autoToggle: true, // [boolean|number] true | false | 3000
    button: {
      closeText: "收合", // [string]
      openText: "展開", // [string]
      class: "btn" // [string]
    },
    class: {
      closed: "closed", // [string]
      closing: "closing", // [string]
      opened: "opened", // [string]
      opening: "opening" // [string]
    },
    transition: true,
    whenTransition: function() {
      console.log("whenTransition");
    }
  };

  function onAnimationEnd(element, type, option) {
    var type = type === "open" ? "open" : type === "close" ? "clos" : undefined;
    setTimeout(() => {
      $(element)
        .removeClass(option.class[type + "ing"] + " " + type + "ing")
        .addClass(option.class[type + "ed"]);
    }, option.transition);
  }

  function onAnimation(option) {
    if (!!option.transition) {
      setTimeout(() => {
        option.whenTransition();
      }, option.transition / 2);
    }
  }

  function onInit(element, option) {
    $(element)
      .append("<button></button>")
      .addClass(
        (option.openAtStart
          ? "opened " + option.class.opened
          : "closed " + option.class.closed) +
          " " +
          option.button.class
      );
    $(element)
      .children("button")
      .html(
        option.openAtStart ? option.button.closeText : option.button.openText
      )
      .attr("onclick", "$('.banner').banner('toggle')");
    setTimeout(() => {
      $(element).css("transition-duration", option.transition + "ms");
      $(element)
        .children("a")
        .children("img")
        .css("transition-duration", option.transition + "ms");
    }, 1);
  }

  Module.prototype.open = function() {
    $(this.$ele)
      .removeClass(this.option.class.closed + " closed")
      .addClass(
        this.option.class.opened +
          " " +
          this.option.class.opening +
          " opened" +
          " opening"
      );
    $(this.$ele)
      .children("button")
      .html(this.option.button.closeText);
    onAnimation(this.option);
    onAnimationEnd(this.$ele, "open", this.option);
  };

  Module.prototype.close = function() {
    $(this.$ele)
      .removeClass(this.option.class.opened + " opened")
      .addClass(
        this.option.class.closed +
          " " +
          this.option.class.closing +
          " closed" +
          " closing"
      );
    $(this.$ele)
      .children("button")
      .html(this.option.button.openText);
    onAnimation(this.option);
    onAnimationEnd(this.$ele, "close", this.option);
  };

  Module.prototype.toggle = function() {
    if ($(this.$ele).hasClass(this.option.class.opened)) {
      this.close();
      return;
    } else $(this.$ele).hasClass(this.option.class.closed);
    this.open();
  };

  Module.prototype.set = function() {
    onInit(this.$ele, this.option);
    if (this.option.autoToggle) {
      setTimeout(() => {
        this.toggle();
      }, +this.option.autoToggle);
    }
  };

  $.fn[ModuleName] = function(methods) {
    return this.each(function() {
      Module.DEFAULTS = { ...Module.DEFAULTS, ...methods };
      Module.DEFAULTS.transition =
        !!Module.DEFAULTS.transition === true ? 3000 : 0;
      let module = new Module(this, Module.DEFAULTS);
      const EVEN_MAP = {
        action: () => {
          module[methods]();
        },
        option: () => {
          module.set();
        },
        error: () => {
          throw "unsupported options!";
        }
      };
      var actionType =
        typeof methods === "string"
          ? "action"
          : typeof methods === "object"
          ? "option"
          : "error";
      if (!!module) {
        EVEN_MAP[actionType]();
      }
    });
  };
})(jQuery);

//-----------------

// $(".banner").banner("toggle");

$(".banner").banner({
  openAtStart: true,
  autoToggle: 3000,
  class: {
    closed: "cccced", // [string]
    closing: "ccccing", // [string]
    opened: "ooooed", // [string]
    opening: "ooooing" // [string]
  },

  button: {
    closeText: "閉", // [string]
    openText: "開", // [string]
    class: "bbubbb" // [string]
  },
  transition: true
});
// $(".banner").banner("toggle");

// $(".banner").banner("open");

// $(".banner").banner("close");
