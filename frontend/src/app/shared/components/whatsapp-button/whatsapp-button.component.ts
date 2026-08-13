import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `<a href="https://wa.me/51920698122" target="_blank" class="wa-float pulse-anim" title="¡Escríbenos!">
    <svg viewBox="0 0 32 32" width="32" height="32" fill="white"><path d="M16 2a13 13 0 0 0-11 20l-2 6 6-2a13 13 0 1 0 7-24zm0 24a11 11 0 0 1-5.6-1.5l-.4-.2-4.1 1.4 1.1-4-.3-.5A11 11 0 1 1 16 26zm6-8c-.3-.2-2-.9-2.3-1-.3-.2-.5-.3-.7.1s-.8 1-.1 1.3c.7.3 3.9 1.6 4.3 2s-.2 1.4-1.3 1.4c-1 0-3.3-1.2-4.7-2.6-1.4-1.4-2.4-3.5-2.2-4.6.2-1 .6-1.5 1-2 .3-.4.7-.4.9 0 .2.4.7 1.8.8 2.2.2.4 0 .9-.2 1.2l-.6.7c-.2.2-.4.4-.2.8.3.5 1.2 2 2.1 2.8 1 1 2.4 1.4 2.8 1.6.5.2.7.2 1 0 .2-.3 1-1 1.3-1.3.2-.4.2-.7 0-.9z"/></svg>
  </a>`,
  styles: [`.wa-float{position:fixed;bottom:40px;right:40px;background-color:#25d366;color:#FFF;border-radius:50px;text-align:center;font-size:30px;box-shadow: 2px 2px 3px #999;z-index:100;display:flex;align-items:center;justify-content:center;width:60px;height:60px;text-decoration:none;transition:all 0.3s;}.wa-float:hover{background-color:#128c7e;transform:scale(1.1);}`]
})
export class WhatsappButtonComponent {}
