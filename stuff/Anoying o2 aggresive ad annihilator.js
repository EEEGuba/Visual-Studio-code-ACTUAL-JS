// ==UserScript==
// @name         Annoying o2 ad popup annihilator
// @match        https://poczta.o2.pl/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=o2.pl
// @grant        none
// ==/UserScript==
(function () {
  'use strict';

  function removeBannerDiv() {
    const a = document.getElementsByClassName('svg-defs')[0];
    const b = document.getElementById('main') || document.querySelector('main');
    if (!a || !b) return;

    const advert = a.nextElementSibling;
    if (advert && advert.tagName === 'DIV' && advert !== b) {
      let n = advert;
      while (n && n !== b) n = n.nextElementSibling;
      if (n === b) advert.remove();
    }
  }

  removeBannerDiv();

  const obs = new MutationObserver(removeBannerDiv);
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();