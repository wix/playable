webpackJsonp([0xbbde18dfa33a],{355:function(n,a){n.exports={data:{site:{siteMetadata:{navigation:[{path:"/player-config",title:"Configuration"},{path:"/themes",title:"Themes"},{path:"/video-source",title:"Video source"},{path:"/api",title:"API reference"},{path:"/modules",title:"Modules"},{path:"/events",title:"Player events"},{path:"/adapters",title:"Playback adapters"}]}},page:{frontmatter:{layout:"simple",title:"Themes",include:null},headings:[{depth:1,value:"Themes"}],html:'<h1 id="themes"><a href="#themes" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Themes</h1>\n<p>We added ability to customize some UI elements. You pass object with theme configuration as second parameret to <a href="/playable/player-config">Playable.create</a> or you can call method <a href="/playable/api#updatetheme">player.updateTheme</a> on instance of Playable player.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>\n  size<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    width<span class="token punctuation">:</span> <span class="token number">160</span><span class="token punctuation">,</span>\n    height<span class="token punctuation">:</span> <span class="token number">90</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> theme <span class="token operator">=</span> <span class="token punctuation">{</span>\n  progressColor<span class="token punctuation">:</span> <span class="token string">"#aaa"</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> player <span class="token operator">=</span> Playable<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>config<span class="token punctuation">,</span> theme<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// ...</span>\n\nplayer<span class="token punctuation">.</span><span class="token function">updateTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  progressColor<span class="token punctuation">:</span> <span class="token string">"#faa"</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Right now we support such parameters:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>theme<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n  liveColor<span class="token punctuation">:</span> <span class="token string">\'#ea492e\'</span><span class="token punctuation">,</span> <span class="token comment">// color of progress bar in live mode</span>\n  progressColor<span class="token punctuation">:</span> <span class="token string">\'#fff\'</span> <span class="token comment">// color of progress bar in default mode</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>You can play with demo <a href="https://jsfiddle.net/OleksiiMakodzeba/xxy5eveb/" target="_blank" rel="nofollow noopener noreferrer">here</a></p>'}},pathContext:{slug:"/themes/"}}}});
//# sourceMappingURL=path---themes-a93035881965b6e2080e.js.map