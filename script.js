'use strict';

// 1. 位置情報の取得
function success(pos) {
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function fail(error) {
    alert('位置情報の取得に失敗しました。エラーコード:' + error.code);
}

navigator.geolocation.getCurrentPosition(success, fail);

// 2. 天気データを取得する関数
function ajaxRequest(lat, long) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appId = '1e3ac7de64cf893df650e32029cfcd8f'; // ★ここを書き換え！

    // 通信開始：ローディング表示
    $('#loader').fadeIn();

    $.ajax({
        url: url,
        data: {
            appid: appId,
            lat: lat,
            lon: long,
            units: 'metric',
            lang: 'ja'
        }
    })
    .done(function(data) {
        console.log('取得成功！:', data);
        
        // 都市名の表示
        $('#place').text(data.city.name + ', ' + data.city.country);

        // ★天気に合わせて背景画像を変える
        const nowWeather = data.list[0].weather[0].main; 
        changeBackground(nowWeather);

        // リストの中身をループ処理
        data.list.forEach(function(forecast, index) {
            const dateTime = new Date(forecast.dt * 1000);
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();
            const hours = dateTime.getHours();
            const min = String(dateTime.getMinutes()).padStart(2, '0');
            const temp = Math.round(forecast.main.temp);
            const weatherDescription = forecast.weather[0].description;
            const iconPath = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

            // 1つ目（現在）は大きくカード表示
            if(index === 0) {
                const currentWeather = `
                <div class="icon"><img src="${iconPath}" alt="天気アイコン"></div>
                <div class="info">
                    <p>
                        <span class="description">現在の天気：${weatherDescription}</span><br>
                        <span class="temp">${temp}℃</span>
                    </p>
                </div>`;
                $('#weather').html(currentWeather);
            } 
            // 2つ目以降はテーブルに追加
            else {
                const tableRow = `
                <tr>
                    <td>${month}/${date} ${hours}:${min}</td>
                    <td><img src="${iconPath}" width="30" style="vertical-align:middle"> ${weatherDescription}</td>
                    <td>${temp}℃</td>
                </tr>`;
                $('#forecast tbody').append(tableRow);
            }
        });
    })
    .fail(function() { 
        console.log('通信エラーが発生しました');
        alert("データの取得に失敗しました。APIキーなどを確認してください。");
    })
    .always(function() { 
        // 通信終了：ローディング非表示
        $('#loader').fadeOut();
    });
}

// ★背景画像切り替え関数
function changeBackground(weather) {
    console.log('今の天気分類:', weather);
    let bgUrl = '';

    // 天気の種類によって画像を振り分け
    switch(weather) {
        case 'Clear': // 晴れ
            bgUrl = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&q=80&w=1920';
            break;
        case 'Clouds': // 曇り
            bgUrl = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&q=80&w=1920';
            break;
        case 'Rain': // 雨
        case 'Drizzle': // 小雨
        case 'Thunderstorm': // 雷雨
            bgUrl = 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&q=80&w=1920';
            break;
        case 'Snow': // 雪
            bgUrl = 'https://images.unsplash.com/photo-1517299321609-52687d1bc555?ixlib=rb-4.0.3&q=80&w=1920';
            break;
        default: // その他（霧など）
            bgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&q=80&w=1920';
            break;
    }

    // bodyの背景画像として設定
    $('body').css('background-image', `url(${bgUrl})`);
}