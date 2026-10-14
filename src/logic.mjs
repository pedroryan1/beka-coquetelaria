export function isAvailable(drink, ingredients) { return drink.available && drink.ingredients.length > 0 && drink.ingredients.every(id => ingredients.some(i=>i.id===id && i.available)); }
export function recommend(drinks,ingredients,prefs) {
 return drinks.filter(d=>isAvailable(d,ingredients))
 .filter(d=>prefs.alcohol==='Tanto faz'||d.alcohol===(prefs.alcohol==='Com álcool'))
 .filter(d=>!prefs.flavor||prefs.flavor==='Surpresa'||d.flavors.includes(prefs.flavor))
 .filter(d=>!prefs.ingredients?.length||prefs.ingredients.every(id=>d.ingredients.includes(id)))
 .map(d=>({...d,score:(prefs.flavor&&d.flavors.includes(prefs.flavor)?3:0)+(prefs.ingredients||[]).filter(id=>d.ingredients.includes(id)).length*2}))
 .sort((a,b)=>b.score-a.score);
}
export function validateEvent(data,today) {
 if(!data.type||!data.date||!data.start||!data.end||!data.location.trim()||!Number.isFinite(Number(data.guests))||Number(data.guests)<1) return 'Preencha o tipo, a data, os horários, o número de convidados e o local do evento.';
 if(data.date<today) return 'Escolha uma data a partir de hoje.';
 if(data.end<=data.start) return 'O término deve ser após o início, no mesmo dia. Para eventos que atravessam a madrugada, combine os horários com a equipe.';
 return '';
}
export function totalItems(items) {return items.reduce((n,i)=>n+i.price*i.quantity,0);}
