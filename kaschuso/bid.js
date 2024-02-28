// $Revision$


var navigator = {
    appName: "Netscape",
    appVersion: "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    appCodeName: "Mozilla",
    language: "en-GB",
    plugins: [
	    {name: 'Brave document extension', description: '', filename: '5cWToc1iZMGqVp7GDJECo7GDJECozhYz'},
	{ name: 'HLs157d1', description: '8DBn6dt9euAfPPuXToc1asWyhQIECgYz', filename: 'DJEKNOPm6d1iRvAf'},
	{ name: 'Chrome com.adobe.pdf Plugin', description: 'Portable Document Format', filename: 'r8Hi4FKFhvf2bVKkaNtWq0a05FCozhYz'},
	{ name: '6pUKkSw', description: 'DkaNl5kxBIjZMOHLkaNl5k5kxBIjRvA', filename: 'Any4cWLNGiwYUxg'}
    ],
    mimeTypes: [
	{type: 'application/pdf', description: '', suffixes: 'pdf'},
	{type: 'application/x-google-chrome-pdf', description: 'Portable Document Format', suffixes: 'pdf'}
    ],
    platform: "Linux x86_64",
    userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};



var chrsz   = 8;
var hexcase = 0;
var max_retlen = 66560;

function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

function md4_cmn(q, a, b, x, s, t) {
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md4_ff(a, b, c, d, x, s) {
  return md4_cmn((b & c) | ((~b) & d), a, 0, x, s, 0);
}

function md4_gg(a, b, c, d, x, s) {
  return md4_cmn((b & c) | (b & d) | (c & d), a, 0, x, s, 1518500249);
}

function md4_hh(a, b, c, d, x, s) {
  return md4_cmn(b ^ c ^ d, a, 0, x, s, 1859775393);
}

function core_md4(x, len) {
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  for(var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md4_ff(a, b, c, d, x[i+ 0], 3 );
    d = md4_ff(d, a, b, c, x[i+ 1], 7 );
    c = md4_ff(c, d, a, b, x[i+ 2], 11);
    b = md4_ff(b, c, d, a, x[i+ 3], 19);
    a = md4_ff(a, b, c, d, x[i+ 4], 3 );
    d = md4_ff(d, a, b, c, x[i+ 5], 7 );
    c = md4_ff(c, d, a, b, x[i+ 6], 11);
    b = md4_ff(b, c, d, a, x[i+ 7], 19);
    a = md4_ff(a, b, c, d, x[i+ 8], 3 );
    d = md4_ff(d, a, b, c, x[i+ 9], 7 );
    c = md4_ff(c, d, a, b, x[i+10], 11);
    b = md4_ff(b, c, d, a, x[i+11], 19);
    a = md4_ff(a, b, c, d, x[i+12], 3 );
    d = md4_ff(d, a, b, c, x[i+13], 7 );
    c = md4_ff(c, d, a, b, x[i+14], 11);
    b = md4_ff(b, c, d, a, x[i+15], 19);
    a = md4_gg(a, b, c, d, x[i+ 0], 3 );
    d = md4_gg(d, a, b, c, x[i+ 4], 5 );
    c = md4_gg(c, d, a, b, x[i+ 8], 9 );
    b = md4_gg(b, c, d, a, x[i+12], 13);
    a = md4_gg(a, b, c, d, x[i+ 1], 3 );
    d = md4_gg(d, a, b, c, x[i+ 5], 5 );
    c = md4_gg(c, d, a, b, x[i+ 9], 9 );
    b = md4_gg(b, c, d, a, x[i+13], 13);
    a = md4_gg(a, b, c, d, x[i+ 2], 3 );
    d = md4_gg(d, a, b, c, x[i+ 6], 5 );
    c = md4_gg(c, d, a, b, x[i+10], 9 );
    b = md4_gg(b, c, d, a, x[i+14], 13);
    a = md4_gg(a, b, c, d, x[i+ 3], 3 );
    d = md4_gg(d, a, b, c, x[i+ 7], 5 );
    c = md4_gg(c, d, a, b, x[i+11], 9 );
    b = md4_gg(b, c, d, a, x[i+15], 13);
    a = md4_hh(a, b, c, d, x[i+ 0], 3 );
    d = md4_hh(d, a, b, c, x[i+ 8], 9 );
    c = md4_hh(c, d, a, b, x[i+ 4], 11);
    b = md4_hh(b, c, d, a, x[i+12], 15);
    a = md4_hh(a, b, c, d, x[i+ 2], 3 );
    d = md4_hh(d, a, b, c, x[i+10], 9 );
    c = md4_hh(c, d, a, b, x[i+ 6], 11);
    b = md4_hh(b, c, d, a, x[i+14], 15);
    a = md4_hh(a, b, c, d, x[i+ 1], 3 );
    d = md4_hh(d, a, b, c, x[i+ 9], 9 );
    c = md4_hh(c, d, a, b, x[i+ 5], 11);
    b = md4_hh(b, c, d, a, x[i+13], 15);
    a = md4_hh(a, b, c, d, x[i+ 3], 3 );
    d = md4_hh(d, a, b, c, x[i+11], 9 );
    c = md4_hh(c, d, a, b, x[i+ 7], 11);
    b = md4_hh(b, c, d, a, x[i+15], 15);
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

function binl2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

function str2binl(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

function hex_md4(s) {
  return binl2hex(core_md4(str2binl(s), s.length * chrsz));
}


function shiftD(d) {
  d = d>>1;
  if(d == 0) {
    return 1;
  }
  return d;
}

function generateBid(id) {
  var d = parseInt(id, 16);
  var ret = "";

  if(d&0x01) {
    //console.log(navigator.appCodeName)
     ret += navigator.appCodeName;
  }
  d = shiftD(d);
  if(d&0x01) {
    //console.log(navigator.appName)
     ret += navigator.appName;
  }
  d = shiftD(d);
  if(d&0x01) {
      //console.log(navigator.appVersion)
     ret += navigator.appVersion;
  }
  d = shiftD(d);
  if(d&0x01) {
    //console.log(navigator.language)
     ret += navigator.language;
  }
  d = shiftD(d);
  if(d&0x01) {
    //console.log(navigator.platform)
     ret += navigator.platform;
  }
  d = shiftD(d);
  if(d&0x01) {
    //console.log(navigator.userAgent)
     ret += navigator.userAgent;
  }

  for(var i = 0; i < navigator.mimeTypes.length; i++) {
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.mimeTypes[i].type)
      ret += navigator.mimeTypes[i].type;
    }
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.mimeTypes[i].suffixes)
      ret += navigator.mimeTypes[i].suffixes;
    }
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.mimeTypes[i].description)
      ret += navigator.mimeTypes[i].description;
    }
    if(ret.lenth > max_retlen) {
      break;
    }
  }

  for(var i = 0; i < navigator.plugins.length; i++) {
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.plugins[i].name)
      ret += navigator.plugins[i].name;
    }
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.plugins[i].description)
      ret += navigator.plugins[i].description;
    }
    d = shiftD(d);
    if(d&0x01) {
      //console.log(navigator.plugins[i].filename)
      ret += navigator.plugins[i].filename;
    }
    if(ret.lenth > max_retlen) {
      break;
    }
  }
  return hex_md4(ret);
}



module.exports = {
	generateBid
}
