// Datum im Footer
(function(){ 
  var d = new Date(); 
  document.getElementById('year').textContent = d.getFullYear();
})();

// -------- Preis-/Gewinnrechner --------
function formatEuro(n){ return n.toLocaleString('de-DE',{style:'currency',currency:'EUR'}); }
function berechneProfit(){
  var brutto   = parseFloat(document.getElementById('sell').value || "0");
  var ust      = parseFloat(document.getElementById('vatSell').value || "0");
  var ek       = parseFloat(document.getElementById('cost').value || "0");
  var versand  = parseFloat(document.getElementById('ship').value || "0");
  var feePct   = parseFloat(document.getElementById('feePct').value || "0");
  var feeFix   = parseFloat(document.getElementById('feeFix').value || "0");

  var ustBetrag   = brutto - (brutto / (1 + ust/100));
  var gebuehrPct  = brutto * (feePct/100);
  var gebuehren   = gebuehrPct + feeFix;

  var nachGebUstVers = brutto - gebuehren - ustBetrag - versand;
  var nachEinkauf     = nachGebUstVers - ek;

  document.getElementById('profitOut').innerHTML =
    'Erlöse nach Abzug von Gebühren, Mehrwertsteuer und Versandkosten: <strong>' + formatEuro(nachGebUstVers) + '</strong><br>' +
    'Erlöse nach Abzug von Einkaufspreis: <strong>' + formatEuro(nachEinkauf) + '</strong>';
}
document.getElementById('btnProfit').addEventListener('click', berechneProfit);
berechneProfit();

// -------- Währungsrechner --------
function zahl(v){ return parseFloat(String(v||"0").replace(",", ".")); }
function holeZahl(id){ return zahl(document.getElementById(id).value); }
function holeKurse(){
  return { EUR:1, USD:holeZahl('rateUSD'), GBP:holeZahl('rateGBP'), CNY:holeZahl('rateCNY') };
}
function formatBetrag(n,cc){
  try{ return new Intl.NumberFormat('de-DE',{style:'currency',currency:cc}).format(n); }
  catch(e){ return (isFinite(n)? n.toFixed(2): n)+' '+cc; }
}
function berechneWaehrung(){
  var betrag = zahl(document.getElementById('fxAmount').value);
  var basis  = document.getElementById('fxBase').value; // EUR|USD|GBP|CNY
  var r      = holeKurse();
  if(!r.USD || !r.GBP || !r.CNY){ document.getElementById('fxOut').innerHTML='Bitte Kurse prüfen.'; return; }

  // in EUR umrechnen
  var betragEUR = (basis==='EUR') ? betrag : betrag / r[basis];

  var alle = ['EUR','USD','GBP','CNY'];
  var zeileOben = alle.filter(function(cc){ return cc!==basis; })
                      .map(function(cc){ return cc+': <strong>'+formatBetrag(betragEUR*r[cc], cc)+'</strong>'; })
                      .join(' · ');
  var zeileAlle = alle.map(function(cc){
                    var v = betragEUR*r[cc];
                    return cc+': <strong>'+formatBetrag(v, cc)+'</strong>'+(cc===basis?' (Basis)':'');
                  }).join(' · ');

  document.getElementById('fxOut').innerHTML =
    '<div><span class="small">Ausgang:</span> <strong>'+formatBetrag(betrag, basis)+'</strong></div>'+
    '<div>'+zeileOben+'</div>'+
    '<hr>'+
    '<div class="small">Alle Währungen: <br>'+zeileAlle+'</div>';
}
document.getElementById('btnFx').addEventListener('click', berechneWaehrung);
['fxAmount','fxBase','rateUSD','rateGBP','rateCNY'].forEach(function(id){
  var el = document.getElementById(id);
  el.addEventListener('input', berechneWaehrung);
  el.addEventListener('change', berechneWaehrung);
});
berechneWaehrung();

// -------- The Magic Button --------
(function(){
  var btn = document.getElementById('trickyBtn');
  btn.addEventListener('mousemove', function(e){
    var r = btn.getBoundingClientRect(), pad = 30;
    if (e.clientX > r.left-pad && e.clientX < r.right+pad && e.clientY > r.top-pad && e.clientY < r.bottom+pad){
      var parent = btn.parentElement.getBoundingClientRect();
      var nx = Math.max(0, Math.min(parent.width - r.width, Math.random()*(parent.width - r.width)));
      var ny = Math.max(0, Math.min(parent.height - r.height, Math.random()*(parent.height - r.height)));
      btn.style.position='relative'; btn.style.left = nx+'px'; btn.style.top = ny+'px';
    }
  });
})();
