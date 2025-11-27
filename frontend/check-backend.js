/* 
 * Backend adatszerkezet ellenőrző
 * Nyisd meg a böngésző konzolt (F12), másold be ezt a kódot és futtasd le.
 * Ez segít kideríteni, milyen mezőneveket használ a backend.
 */

// 1. Ellenőrizd a localStorage-t
console.log('=== LocalStorage ellenőrzés ===');
console.log('authToken:', localStorage.getItem('authToken') ? '✅ Van' : '❌ Nincs');
console.log('Token érték:', localStorage.getItem('authToken')?.substring(0, 50) + '...');

// 2. Kérdezd le a felhasználókat
async function checkBackendData() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.error('❌ Nincs token! Jelentkezz be!');
        return;
    }

    console.log('\n=== Backend lekérdezés ===');
    console.log('URL:', 'http://localhost:3000/felhasznalokLekerdezese');
    
    try {
        const response = await fetch('http://localhost:3000/felhasznalokLekerdezese', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Státusz:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Hiba:', error);
            return;
        }

        const data = await response.json();
        
        console.log('\n=== Sikeres válasz ===');
        console.log('Felhasználók száma:', data.length);
        
        if (data.length > 0) {
            console.log('\n=== Első felhasználó adatai ===');
            console.log(data[0]);
            
            console.log('\n=== Mezőnevek (kulcsok) ===');
            console.log(Object.keys(data[0]));
            
            console.log('\n=== Mezők és értékek ===');
            Object.entries(data[0]).forEach(([key, value]) => {
                console.log(`${key}:`, value, `(${typeof value})`);
            });

            console.log('\n=== Ellenőrzés ===');
            console.log('felhasznalonev mező:', data[0].felhasznalonev ? '✅' : '❌');
            console.log('felh_nev mező:', data[0].felh_nev ? '✅' : '❌');
            console.log('email mező:', data[0].email ? '✅' : '❌');
            console.log('szerepkor mező:', data[0].szerepkor ? '✅' : '❌');
            console.log('created_at mező:', data[0].created_at ? '✅' : '❌');
            console.log('id mező:', data[0].id ? '✅' : '❌');
        }

        console.log('\n=== Összes felhasználó ===');
        console.table(data);
        
    } catch (error) {
        console.error('❌ Hálózati hiba:', error);
    }
}

// Futtasd le!
checkBackendData();
