// jshint browser: false
let taslar = [];
let tahtanin_hücreleri = [];
let secilen_hucre = null;
let Oyuncu = function(renk){
    this.sah_cekme = false;
	this.renk = renk;
    this.sah = null;
    this.sahHareketi = false;
    this.terfi = null;
    this.hareket = null;}
let sira = 1;
let beyaz = new Oyuncu("beyaz")
let siyah = new Oyuncu("siyah")
let aktifOyuncu = beyaz;
let HucreNesnesi = function(x, y, renk, secim, element, tas){
	this.x = x;
	this.y = y;
	this.renk = renk;
	this.secim = secim;
	this.element = element;
	this.tas = tas;}

HucreNesnesi.prototype.tasAta = function(tas){
	this.tas = tas;
	this.guncelle()}

HucreNesnesi.prototype.tasKaldir = function(){
	this.tas = null;
	this.guncelle();}

HucreNesnesi.prototype.guncelle = function(){
	this.element.className = "hucre " + this.renk + " " + (this.secim ? "secim" : "") + " " + (this.tas === null ? "bos" : this.tas.renk + "-" + this.tas.type);}

HucreNesnesi.prototype.sec = function(){
	this.secim = true;
	this.guncelle();}

HucreNesnesi.prototype.secimikaldir = function(){
	this.secim = false;
	this.guncelle();}

HucreNesnesi.prototype.hucreDolulugu = function(){
	return this.tas !== null;}

let Tas = function(x, y, renk, type){
	this.renk = renk;
	this.type = type;
	this.x = x;
	this.y = y;
	this.alinan_tas = false;
    this.sonhareket = 0;
    this.ikiileri = 0;}
Tas.prototype.alma = function(){
	this.alinan_tas = true;
    alinanTasinGosterimi(this);}

let Kale = function(x, y, renk){
	this.renk = renk;
	this.type = "kale";
	this.x = x;
	this.y = y;}
Kale.prototype = new Tas();

Kale.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = (hedefHucre.y-this.y);
	let hareketX = (hedefHucre.x-this.x);
	let yonX = hareketX ? (hareketX / Math.abs(hareketX)) : 0;
	let yonY = hareketY ? (hareketY / Math.abs(hareketY)) : 0;
	let sonuc = {gecerli : false, alma : null};
	if(hareketX == 0 || hareketY == 0){
		let engellenmis = false;
		for(let testX = this.x+yonX, testY = this.y+yonY; testX != hedefHucre.x || testY != hedefHucre.y; testX += yonX, testY += yonY){
			hucreKontrol = hucreGetir(testX, testY);
			engellenmis = engellenmis || hucreKontrol.hucreDolulugu();}
		if(!engellenmis){
			if(!hedefHucre.hucreDolulugu()){
				sonuc = {gecerli : true, alma : null};
			}else if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
				sonuc = {gecerli : true, alma : hedefHucre};}}}
    if(n==2) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
	return sonuc;}

let At = function(x, y, renk){
	this.renk = renk;
	this.type = "at";
	this.x = x;
	this.y = y;}
At.prototype = new Tas();

At.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = hedefHucre.y-this.y;
	let hareketX = hedefHucre.x-this.x;
	let sonuc = {gecerli : false, alma : null};
	if((Math.abs(hareketX) == 2 && Math.abs(hareketY) == 1) || (Math.abs(hareketX) == 1 && Math.abs(hareketY) == 2)){
		if(!hedefHucre.hucreDolulugu()){
			sonuc = {gecerli : true, alma : null};
		}else if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
			sonuc = {gecerli : true, alma : hedefHucre};}}
    if(n==2) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
	return sonuc;}

let Fil = function(x, y, renk){
	this.renk = renk;
	this.type = "fil";
	this.x = x;
	this.y = y;}
Fil.prototype = new Tas();

Fil.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = (hedefHucre.y-this.y);
	let hareketX = (hedefHucre.x-this.x);
	let yonX = hareketX ? (hareketX / Math.abs(hareketX)) : 0;
	let yonY = hareketY ? (hareketY / Math.abs(hareketY)) : 0;
	let sonuc = {gecerli : false, alma : null};
	if(Math.abs(hareketX) == Math.abs(hareketY)){
		let engellenmis = false;
		for(let testX = this.x+yonX, testY = this.y+yonY; testX != hedefHucre.x || testY != hedefHucre.y; testX += yonX, testY += yonY){
			hucreKontrol = hucreGetir(testX, testY);
			engellenmis = engellenmis || hucreKontrol.hucreDolulugu();}
		if(!engellenmis){
			if(!hedefHucre.hucreDolulugu()){
				sonuc = {gecerli : true, alma : null};
			}else if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
				sonuc = {gecerli : true, alma : hedefHucre};}}}
    if(n==2) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
	return sonuc;}

let Vezir = function(x, y, renk){
	this.renk = renk;
	this.type = "vezir";
	this.x = x;
	this.y = y;}
Vezir.prototype = new Tas();

Vezir.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = (hedefHucre.y-this.y);
	let hareketX = (hedefHucre.x-this.x);
	let yonX = hareketX ? (hareketX / Math.abs(hareketX)) : 0;
	let yonY = hareketY ? (hareketY / Math.abs(hareketY)) : 0;
	let sonuc = {gecerli : false, alma : null};
	if(Math.abs(hareketX) == Math.abs(hareketY) || hareketX == 0 || hareketY == 0){
		let engellenmis = false;
		for(let testX = this.x+yonX, testY = this.y+yonY; testX != hedefHucre.x || testY != hedefHucre.y; testX += yonX, testY += yonY){
			hucreKontrol = hucreGetir(testX, testY);
			engellenmis = engellenmis || hucreKontrol.hucreDolulugu();}
		if(!engellenmis){
			if(!hedefHucre.hucreDolulugu()){
				sonuc = {gecerli : true, alma : null};
			}else if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
				sonuc = {gecerli : true, alma : hedefHucre};}}}
    if(n==2) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
	return sonuc;}

let Sah = function(x, y, renk){
	this.renk = renk;
	this.type = "sah";
	this.x = x;
	this.y = y;
    this.tehtidEdenTas=null;}
Sah.prototype = new Tas();

Sah.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = hedefHucre.y-this.y;
	let hareketX = hedefHucre.x-this.x;
	let sonuc = {gecerli : false, alma : null};
	if((hareketX >= -1 && hareketX <= 1 && hareketY >= -1 && hareketY <= 1)){
        if(!hedefHucre.hucreDolulugu()){
			sonuc = {gecerli : true, alma : null};
		}else if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
			sonuc = {gecerli : true, alma : hedefHucre};}
        oncekiTas = hedefHucre.tas;
        hedefHucre.tasKaldir();
        for(let i=0;i<taslar.length;i++){
            let hucre = hucreGetir(taslar[i].x, taslar[i].y);
            if(hucre.tas != null && taslar[i].alinan_tas==false){
                if(taslar[i].renk != aktifOyuncu.renk){
                    if(taslar[i] instanceof Piyon){
                        let direction = taslar[i].renk == "beyaz" ? -1 : 1;
                        let hareketY = (hedefHucre.y-taslar[i].y);
                        let hareketX = (hedefHucre.x-taslar[i].x);
                        if(hareketY == direction){
                            if(Math.abs(hareketX) == 1 && Math.abs(hareketY) == 1){
                                if(this.renk != taslar[i].renk){
                                    sonuc.gecerli= false;
                                    hedefHucre.tasAta(oncekiTas);
                                    break;}}}}
                    else if(taslar[i] instanceof Sah){
                        if(this.renk == "beyaz"){
                            if(Math.abs(siyah.sah.x-hedefHucre.x) <= 1 && Math.abs(siyah.sah.y-hedefHucre.y) <= 1){
                                sonuc.gecerli = false;
                                hedefHucre.tasAta(oncekiTas);
                                return sonuc;}
                        }else{
                            if(Math.abs(beyaz.sah.x-hedefHucre.x) <= 1 && Math.abs(beyaz.sah.y-hedefHucre.y) <= 1){
                                sonuc.gecerli = false;
                                hedefHucre.tasAta(oncekiTas);
                                return sonuc;}}}
                    else {
                        if(taslar[i].hareketKurallari(hucreGetir(hedefHucre.x, hedefHucre.y)).gecerli){
                            sonuc.gecerli = false;
                            hedefHucre.tasAta(oncekiTas);
                            return sonuc;}}}}}
        hedefHucre.tasAta(oncekiTas);}
    else if(aktifOyuncu.hareket==aktifOyuncu.sah){
        if(aktifOyuncu.sahHareketi ==false){
            Y = aktifOyuncu==beyaz?8:1;
            if(aktifOyuncu.sah.x==5&&aktifOyuncu.sah.y==Y){
                if(aktifOyuncu.sah_cekme==false){
                   if(hareketX==2){
                       if(hucreGetir(8,Y).tas instanceof Kale){
                           if(hucreGetir(7,Y).tas==null&&hucreGetir(6,Y).tas==null){
                               aktifOyuncu.sahHareketi=true;
                               aktifOyuncu.sah.x= 7;
                               aktifOyuncu.sah.y= Y;
                               if(!kingExposed(aktifOyuncu.sah)){
                                   aktifOyuncu.sah.x= 6;
                                   aktifOyuncu.sah.y= 8;
                                   if( !kingExposed(aktifOyuncu.sah)){
                                       sonuc.gecerli=true;
                                       aktifOyuncu.sahHareketi=true;
                                       let rook = hucreGetir(8,Y).tas;
                                       hucreGetir(8,Y).tasKaldir();
                                       hucreGetir(6,Y).tasAta(rook);
                                       rook.x = 6;
                                       rook.y = Y;}
                                   else {
                                       aktifOyuncu.sahHareketi=false;}}
                               else {
                                   aktifOyuncu.sahHareketi=false;}}}}
                   else if(hareketX==-2){
                       if(hucreGetir(1,Y).tas instanceof Kale){
                           if(hucreGetir(2,Y).tas==null&&hucreGetir(3,Y).tas==null&&hucreGetir(4,Y).tas==null){
                               aktifOyuncu.sahHareketi=true;
                               aktifOyuncu.sah.x= 3;
                               aktifOyuncu.sah.y= Y;
                               if(!kingExposed(aktifOyuncu.sah)){
                                   aktifOyuncu.sah.x= 4;
                                   aktifOyuncu.sah.y= Y;
                                   if( !kingExposed(aktifOyuncu.sah)){
                                       sonuc.gecerli=true;
                                       aktifOyuncu.sahHareketi=true;
                                       let rook = hucreGetir(1,Y).tas;
                                       hucreGetir(1,Y).tasKaldir();
                                       hucreGetir(4,Y).tasAta(rook);
                                       rook.x = 4;
                                       rook.y = Y;}
                                   else {
                                       aktifOyuncu.sahHareketi=false;}}
                               else {
                                   aktifOyuncu.sahHareketi=false;}}}}}}}}
    if(n==2&&aktifOyuncu.sah_cekme==false) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
    if(sonuc.gecerli&&aktifOyuncu.sahHareketi==false){
           aktifOyuncu.sahHareketi=true;}
	return sonuc;}

let Piyon = function(x, y, renk){
	this.renk = renk;
	this.type = "piyon";
	this.x = x;
	this.y = y;}
Piyon.prototype = new Tas();

Piyon.prototype.hareketKurallari = function(hedefHucre,n=1){
    if(n==0) return {gecerli:false, alma:null};
	let hareketY = (hedefHucre.y-this.y);
	let hareketX = (hedefHucre.x-this.x);
	let direction = this.renk == "beyaz" ? -1 : 1;
	let sonuc = {gecerli : false, alma : null};
	if(hareketY == direction * 2 && hareketX == 0 && this.y == (this.renk == "beyaz" ? 7 : 2) && !hucreGetir(this.x, this.y+direction).hucreDolulugu() && !hedefHucre.hucreDolulugu()){
		sonuc = {gecerli : true, alma : null};
    this.ikiileri = sira;
	}else if(hareketY == direction){
		if(Math.abs(hareketX) == 1){
			if(hedefHucre.hucreDolulugu() && hedefHucre.tas.renk != this.renk){
				sonuc = {gecerli : true, alma : hedefHucre};}
		}else if(hareketX == 0 && !hedefHucre.hucreDolulugu()){
			sonuc = {gecerli : true, alma : null}}}
    if(aktifOyuncu==beyaz){
        if(hedefHucre.y==1&&this.y==2){
            if(sonuc.alma!=null&&Math.abs(hareketX)==1||sonuc.alma==null&&Math.abs(hareketX)==0&&!hedefHucre.hucreDolulugu()){
                sonuc.gecerli=true;
                sonuc.terfi=true;}}}
    else if(aktifOyuncu==siyah){
        if(hedefHucre.y==8&&this.y==7){
            if(sonuc.alma!=null&&Math.abs(hareketX)==1||sonuc.alma==null&&Math.abs(hareketX)==0&&!hedefHucre.hucreDolulugu()){
                sonuc.gecerli=true;
                sonuc.terfi=true;}}}
    if(n==2) {
        for(let i=0;i<taslar.length;i++){
            if(taslar[i].renk != aktifOyuncu.renk){
                if(taslar[i].alinan_tas==true) continue;
                if(taslar[i].hareketKurallari(hucreGetir(aktifOyuncu.sah.x, aktifOyuncu.sah.y),n-1).gecerli){
                    sonuc.gecerli = false;
                    break;}}}}
	return sonuc;}

let run = function(){
	let boardContainer = document.getElementById("board");
	for(let i = 1; i <= 8; i++){
		for (let j = 1; j <= 8; j++){
			let squareElement = document.createElement("div");
			let renk = (j+i) % 2 ? "siyah_hucre" : "beyaz_hucre";
			squareElement.addEventListener("click", hucreTiklama);
			squareElement.setAttribute("data-x", j);
			squareElement.setAttribute("data-y", i);
			let hucre = new HucreNesnesi(j, i, renk, false, squareElement, null);
			hucre.guncelle();
			tahtanin_hücreleri.push(hucre);
			boardContainer.appendChild(squareElement);}}

    beyaz.sah = new Sah(5, 8, "beyaz");
    siyah.sah = new Sah(5, 1, "siyah");
    taslar.push(beyaz.sah);
    taslar.push(siyah.sah);
	taslar.push(new Kale(1, 1, "siyah"));
	taslar.push(new At(2, 1, "siyah"));
	taslar.push(new Fil(3, 1, "siyah"));
	taslar.push(new Vezir(4, 1, "siyah"));
	taslar.push(new Fil(6, 1, "siyah"));
	taslar.push(new At(7, 1, "siyah"));
	taslar.push(new Kale(8, 1, "siyah"));
	taslar.push(new Kale(1, 8, "beyaz"));
	taslar.push(new At(2, 8, "beyaz"));
	taslar.push(new Fil(3, 8, "beyaz"));
	taslar.push(new Vezir(4, 8, "beyaz"));
	taslar.push(new Fil(6, 8, "beyaz"));
	taslar.push(new At(7, 8, "beyaz"));
	taslar.push(new Kale(8, 8, "beyaz"));
	for(let i = 1; i < 9; i++){
        taslar.push(new Piyon(i, 2, "siyah"));}
	for(let i = 1; i < 9; i++){
        taslar.push(new Piyon(i, 7, "beyaz"));}
	for(let i = 0; i < taslar.length; i++){
		hucreGetir(taslar[i].x, taslar[i].y).tasAta(taslar[i]);}};

let showError = function(mesaj) {
    var hataElementi = document.getElementById("hata_mesaji");
    hataElementi.innerHTML = mesaj;
    var kaplamaElementi  = document.getElementById("uyari_mesaji");
    kaplamaElementi .className = "kaplama show";
    var kapatmaButonu = document.getElementsByClassName("kaplama-buton")[0]; // Close butonunu seç

    // Eğer mesaj "checkmate" ise, bir buton ekleyin
    if (mesaj === "Şah Mat") {
        kapatmaButonu.innerHTML = "Yeni Oyun"; // Özel durum için metni değiştir
        kapatmaButonu.onclick = function() { // Butona tıklandığında çalışacak fonksiyon
            kaplamaElementi .className = "kaplama"; // Overlay'i gizle
            hataElementi.innerHTML = ""; // Hata mesajını temizle
            yenidenBaslatma();};
        // Hata mesajı alanına butonu ekleyin
        hataElementi.appendChild(buton);}}

let hata_kapatma = function(){
	document.getElementById("uyari_mesaji").className = "kaplama";}

let hucreGetir = function(x, y){
	return tahtanin_hücreleri[y*8+x-9];}

let hucreTiklama = function(){
	let x = Number(this.getAttribute("data-x"));
	let y = Number(this.getAttribute("data-y"));
	let hucre = hucreGetir(x, y);
	if(secilen_hucre === null){
        if(hucre.tas.renk != aktifOyuncu.renk){
		}else{
			secilen_hucre = hucreGetir(x, y);
			secilen_hucre.sec();}}
    else{
		if(secilen_hucre.x == x && secilen_hucre.y == y){
			secilen_hucre.secimikaldir();
			secilen_hucre = null;}
        else{
            if(hucre.tas != null && hucre.tas.renk == aktifOyuncu.renk){
                secilen_hucre.secimikaldir();
                secilen_hucre = hucreGetir(x, y);
                secilen_hucre.sec();}
            else {
                move(secilen_hucre, hucre);}}}}

let move = function(start, end){
	let tas = start.tas;
    aktifOyuncu.hareket = start.tas;
	let moveResult = tas.hareketKurallari(end);
    if(aktifOyuncu==beyaz) {
        siyah.sah_cekme=false;
        siyah.sah.tehtidEdenTas=null;}
    else {
        beyaz.sah_cekme=false;
        beyaz.sah.tehtidEdenTas=null;}
	if(moveResult.gecerli){
        capturedPiece = null;
        if(moveResult.alma !== null){
            moveResult.alma.tas.alma();
            capturedPiece = moveResult.alma.tas;
            moveResult.alma.tasKaldir();}
        tas.x = end.x;
        tas.y = end.y;
        end.tasAta(tas);
        start.tasKaldir();
        if(kingExposed(aktifOyuncu.sah)){
                end.tasKaldir();
                tas.x = start.x;
                tas.y = start.y;
                start.tasAta(tas);
                if(moveResult.alma !== null){
                    capturedPiece.alinan_tas = false;
                    moveResult.alma.tasAta(capturedPiece);}
                return;}
        end.tas.sonhareket = sira;
        start.tasKaldir();
        start.secimikaldir();
        secilen_hucre = null;
        if(moveResult.terfi==true){
            aktifOyuncu.terfi=end.tas;
            showPromotion(aktifOyuncu);
            return;}
        if(aktifOyuncu==beyaz){
            if(end.tas.hareketKurallari(hucreGetir(siyah.sah.x, siyah.sah.y),2).gecerli){
                showError("Şah")
                siyah.sah_cekme=true;
                siyah.sah.tehtidEdenTas = end.tas;}
            if(kingExposed(siyah.sah)){
                siyah.sah_cekme=true;
                if(isCheckmate(siyah.sah)){
                    showError("Şah Mat");
                    return;}
                showError("Şah")}}
        else{
            if(end.tas.hareketKurallari(hucreGetir(beyaz.sah.x, beyaz.sah.y),2).gecerli){
                showError("Şah")
                beyaz.sah_cekme=true;
                beyaz.sah.tehtidEdenTas = end.tas;}
            if(kingExposed(beyaz.sah)){
                beyaz.sah_cekme=true;
                if(isCheckmate(beyaz.sah)){
                    showError("Şah Mat");
                    return;}
                showError("Şah")}}
        nextTurn();
	}else{
        tas.x = start.x;
        tas.y = start.y;
        start.tasAta(start.tas);}}

let isCheckmate = function(sah){
    let myPlayer = aktifOyuncu;
    let otherPlayer = aktifOyuncu==beyaz?siyah:beyaz;
    aktifOyuncu=otherPlayer;
    if(aktifOyuncu.sah_cekme==false){
        aktifOyuncu=myPlayer;
        return false;}
    for(let i=-1;i<2;i++){
        for(let j=-1;j<2;j++){
            if(sah.x+i<=8&&sah.x+i>=1){
                if(sah.y+j<=8&&sah.y+j>=1){
                    if(i!=0||j!=0){
                        if(hucreGetir(sah.x+i,sah.y+j).tas!=null&&hucreGetir(sah.x+i,sah.y+j).tas.renk==aktifOyuncu.renk) {
                            continue;}
                        let hucre = hucreGetir(sah.x+i,sah.y+j);
                        if(sah.hareketKurallari(hucre).gecerli&&!hucre.hucreDolulugu()){
                            let oldsquare = hucreGetir(sah.x, sah.y);
                            oldsquare.tasKaldir(sah);
                            hucre.tasAta(sah);
                            let kingId = -1;
                            if(sah.renk=="beyaz")
                                kingId = 0;
                            else kingId = 1;
                            taslar[kingId].x= sah.x+i;
                            taslar[kingId].y= sah.y+j;
                            if(!kingExposed(aktifOyuncu.sah)){
                                hucre.tasKaldir(sah);
                                oldsquare.tasAta(sah);
                                taslar[kingId].x= oldsquare.x;
                                taslar[kingId].y= oldsquare.y;
                                aktifOyuncu=myPlayer;
                                return false;}
                            hucre.tasKaldir(sah);
                            oldsquare.tasAta(sah);
                            taslar[kingId].x= oldsquare.x;
                            taslar[kingId].y= oldsquare.y;}}}}}}
    for(let i=0;i<taslar.length;i++){
        if(aktifOyuncu.renk== taslar[i].renk){
            if(taslar[i].hareketKurallari(hucreGetir(sah.tehtidEdenTas.x, sah.tehtidEdenTas.y),2).gecerli){
                aktifOyuncu=myPlayer;
                return false;}}}
    if(sah.tehtidEdenTas.tas instanceof At) return true;
    for(let i=0;i<taslar.length;i++){
        if(taslar[i].alinan_tas==true) continue;
        if(aktifOyuncu.renk==taslar[i].renk){
            if(taslar[i] instanceof Piyon) {
                for(let dir=1;dir<=2;dir++){
                    let direction = aktifOyuncu.renk == "beyaz" ? -1 : 1;
                    let hucre = hucreGetir(taslar[i].x,taslar[i].y+direction*dir)
                    if(taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);}
                    else continue;
                    if(!kingExposed(aktifOyuncu.sah)){
                        hucre.tasKaldir(taslar[i]);
                        aktifOyuncu=myPlayer;
                        return false;}
                    hucre.tasKaldir(taslar[i]);}}
            else if(taslar[i] instanceof At){
                for(let dir=1;dir<=2;dir++){
                    let hucre = hucreGetir(taslar[i].x+(3-dir),taslar[i].y+dir)
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x+(3-dir),taslar[i].y-dir)
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x-dir,taslar[i].y+(3-dir))
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x-dir,taslar[i].y-(3-dir))
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}}}
            else if(taslar[i] instanceof Kale){
                for(let k=-8;k<=8;k++){
                    if(taslar[i].x+k>=1&&taslar[i].x+k<=8&&taslar[i].y+k>=1&&taslar[i].y+k<=8){
                        let hucre = hucreGetir(taslar[i].x+k,taslar[i].y);
                        if(taslar[i].hareketKurallari(hucre,2).gecerli){
                            hucre.tasAta(taslar[i]);
                            if(!kingExposed(aktifOyuncu.sah)){
                                aktifOyuncu=myPlayer;
                                hucre.tasKaldir(taslar[i]);
                                return false;}
                            hucre.tasKaldir(taslar[i]);}
                        hucre = hucreGetir(taslar[i].x,taslar[i].y+k);
                        if(taslar[i].hareketKurallari(hucre,2).gecerli){
                            hucre.tasAta(taslar[i]);
                            if(!kingExposed(aktifOyuncu.sah)){
                                aktifOyuncu=myPlayer;
                                hucre.tasKaldir(taslar[i]);
                                return false;}
                            hucre.tasKaldir(taslar[i]);}}}}
            else if(taslar[i] instanceof Fil){
                for(let k=-8;k<=8;k++){
                    let hucre = hucreGetir(taslar[i].x+k,taslar[i].y+k);
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x+k,taslar[i].y-k);
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}}}
            else if(taslar[i] instanceof Vezir){
                for(let k=-8;k<=8;k++){
                    let hucre = hucreGetir(taslar[i].x+k,taslar[i].y+k);
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x+k,taslar[i].y-k);
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}}
                for(let k=-8;k<=8;k++){
                    let hucre = hucreGetir(taslar[i].x+k,taslar[i].y+k)
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}
                    hucre = hucreGetir(taslar[i].x+k,taslar[i].y-k)
                    if(hucre!=null&&taslar[i].hareketKurallari(hucre,2).gecerli){
                        hucre.tasAta(taslar[i]);
                        if(!kingExposed(aktifOyuncu.sah)){
                            aktifOyuncu=myPlayer;
                            hucre.tasKaldir(taslar[i]);
                            return false;}
                        hucre.tasKaldir(taslar[i]);}}}}}
    return true;}

let showPromotion = function(oyuncu){
	document.getElementById("terfi_mesaji").className = "kaplama show";
	document.getElementById("terfi_taslari").className = oyuncu.renk;}

let closePromotion = function(){
	document.getElementById("terfi_mesaji").className = "kaplama";}

let terfi = function(type){
	let newPiece;
	let oncekiTas = aktifOyuncu.terfi;
	let index = taslar.indexOf(oncekiTas);
	switch(type){
		case "vezir":
			newPiece = new Vezir(oncekiTas.x, oncekiTas.y, oncekiTas.renk);
			break;
		case "kale":
			newPiece = new Kale(oncekiTas.x, oncekiTas.y, oncekiTas.renk);
			break;
		case "fil":
			newPiece = new Fil(oncekiTas.x, oncekiTas.y, oncekiTas.renk);
			break;
		case "at":
			newPiece = new At(oncekiTas.x, oncekiTas.y, oncekiTas.renk);
			break;}
	if(index != -1){
        hucreGetir(oncekiTas.x, oncekiTas.y).tasKaldir();
		taslar[index] = newPiece;
		hucreGetir(oncekiTas.x, oncekiTas.y).tasAta(newPiece);
		aktifOyuncu.terfi = null;
		closePromotion();
		if(aktifOyuncu==beyaz){
            if(newPiece.hareketKurallari(hucreGetir(siyah.sah.x, siyah.sah.y),2).gecerli){
                showError("Şah")
                siyah.sah_cekme=true;
                beyaz.sah.tehtidEdenTas = newPiece;}
            if(kingExposed(siyah.sah)){
                showError("Şah")
                siyah.sah_cekme=true;
                siyah.sah.tehtidEdenTas = newPiece;}}
        else{
            if(newPiece.hareketKurallari(hucreGetir(beyaz.sah.x, beyaz.sah.y),2).gecerli){
                showError("Şah")
                beyaz.sah_cekme=true;}
            if(kingExposed(beyaz.sah)){
                showError("Şah")
                beyaz.sah_cekme=true;}}
        nextTurn();}}

let kingExposed = function(at){
    for(let i=0;i<taslar.length;i++){
        let hucre = hucreGetir(taslar[i].x, taslar[i].y);
        if(taslar[i].renk != at.renk && taslar[i].alinan_tas==false){
            if(taslar[i] instanceof Piyon){
                let direction = taslar[i].renk == "beyaz" ? -1 : 1;
                let hareketY = (at.y-taslar[i].y);
                let hareketX = (at.x-taslar[i].x);
                if(hareketY == direction){
                    if(Math.abs(hareketX) == 1){
                        at.tehtidEdenTas = taslar[i];
                        return true;}}}
            else{
                if(hucre.tas.hareketKurallari(hucreGetir(at.x, at.y)).gecerli){
                    at.tehtidEdenTas = taslar[i];
                    return true;}}}}
    return false;}

let nextTurn = function(){
    sira++;
	if(aktifOyuncu.renk == "beyaz"){
		aktifOyuncu = siyah;
        document.getElementById("turnInfo").innerHTML = "Hamle Sırası: <b>Siyah</b>";
	}else{
		aktifOyuncu = beyaz;
        document.getElementById("turnInfo").innerHTML = "Hamle Sırası: <b>Beyaz</b>";}}

//eklemeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee//
function alinanTasinGosterimi(tas) {
    var capturedContainer = document.querySelector('.alinan_tas.' + tas.renk);
    var img = document.createElement('div');
    img.className = 'alinan_tas-tas';
    img.style.backgroundImage = 'url("../taslar.png")';
    img.style.backgroundPosition = getBackgroundPosition(tas);
    img.style.width = '80px'; // Gereksinimlerinize göre ayarlayın
    img.style.height = '80px'; // Gereksinimlerinize göre ayarlayın
    capturedContainer.appendChild(img);
    // Skor güncelleme
    updateScore(tas);}

function getBackgroundPosition(tas) {
    var indexMap = {
        'vezir': 1,  // Vezirin pozisyonu
        'fil': 2, // Filin pozisyonu
        'at': 3, // Atın pozisyonu
        'kale': 4,   // Kalenin pozisyonu
        'piyon': 5    // Piyonun pozisyonu
    };
    var x = (indexMap[tas.type] * -100) + '%'; // X pozisyonunu hesaplama, 6 sütun var
    var y = tas.renk === 'beyaz' ? '0%' : '-100%'; // Y pozisyonunu hesaplama, 2 satır var
    return x+" "+y;}

function yenidenBaslatma() {
    window.location.reload();}

let beyazScore = 0;
let siyahScore = 0;

function updateScore(tas) {
    switch(tas.type){
        case "vezir":
            point = 9; // Siyah vezir yendi
            break;
        case "kale":
            point = 5; // Siyah kale yendi
            break;
        case "fil":
            point = 3; // Siyah fil yendi
            break;
        case "at":
            point = 3; // Siyah at yendi
            break;
        case "piyon":
            point = 1; // Siyah piyon yendi
            break;}
    if (tas.renk === 'beyaz') {
        siyahScore = siyahScore + point
        document.getElementById('siyahScore').innerText = siyahScore;
    } else {
        beyazScore = beyazScore + point; // Beyaz taş yendi, beyaz skoru artır
        document.getElementById('beyazScore').innerText = beyazScore;}}