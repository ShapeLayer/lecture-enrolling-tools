// ==UserScript==
// @name         Captcha Unlocker
// @namespace    https://jonghyeon.me/
// @version      0.1
// @description  전남대학교 수강신청 매크로방지 문자 OCR 입력 유저스크립트
// @downloadURL  https://raw.githack.com/ShapeLayer/lecture-enrolling-tools/main/captchaUnlocker.user.js/captchaUnlocker.user.js
// @updateURL    https://raw.githack.com/ShapeLayer/lecture-enrolling-tools/main/captchaUnlocker.user.js/captchaUnlocker.user.js
// @author       ShapeLayer
// @include      https://hak.jnu.ac.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
  let base64 = LoadImage()
  let c = document.getElementById('canvas')
  console.log(c, base64)
  OCR(c)
  document.onkeypress = (e) => {
      // = 키: 다시 이미지 불러오기
      if (e.keyCode == 61) {
          base64 = LoadImage()
          OCR(base64)
      }
      // - 키: 내용 비우기
      else if (e.keyCode == 45) document.getElementById('ctl00_ctl00_ContentPlaceHolderMain_ContentPlaceHolderSub_txtInsVal').value = ''
  }
})();

function LoadImage () {
  // Get Image Base64
  let imgs = document.getElementsByTagName('img')
  let target = ''
  for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].getAttribute('src').includes('CreatImage.aspx')) {
          target = imgs[i]
      }
  }
  let canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'canvas')
  document.body.appendChild(canvas)
  let c = document.getElementById('canvas')
  let ctx = c.getContext('2d')
  ctx.canvas.width = 45
  ctx.canvas.height = 19
  ctx.drawImage(target, 0, 0)
  let base64 = c.toDataURL()
  return (c, base64)
}
function OCR (c) {
  // Tesseract Worker
  const worker = Tesseract.createWorker({
      logger: m => console.log(m)
  });
  (async () => {
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const { data: { text } } = await worker.recognize(c)
      console.log(text)
      document.getElementById('ctl00_ctl00_ContentPlaceHolderMain_ContentPlaceHolderSub_txtInsVal').value = text
      await worker.terminate()
  })();
  /*
  Tesseract.recognize(
      c,
      'eng',
      { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
      document.getElementById('ctl00_ctl00_ContentPlaceHolderMain_ContentPlaceHolderSub_txtInsVal').value = text
  })*/
}