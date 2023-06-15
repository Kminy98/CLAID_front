const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

window.onload = () => {

}

/**
 * 작성자 : 공민영
 * 내용 : 회원가입 버튼 클릭시 인증이메일 전송
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function saveMail() {
    const nickname = document.getElementById("nickname").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const password_check = document.getElementById("password_check").value


    const error = document.getElementById("error")

    console.log(nickname, email, password)

    const response = await fetch('http://127.0.0.1:8000/user/signup/', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "nickname": nickname,
            "email": email,
            "password": password,
        })
    })
    console.log(response)

    // 에러메시지
    const response_json = await response.json()
    const err = response_json.message
    console.log(err)



    /*비밀번호 확인*/
    if (password != password_check) {
        alert("비밀번호가 맞지않습니다")
    } else if (password === password_check) {
        // 이메일 인증 되어있는지 확인
        if (response.status == 201) {
            alert("email 발송! email 확인하여 인증 성공 시 가입 완료")
            handleLogout()
            window.location.replace('login.html')
        } else {
            alert(err)
        }

    }
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 버튼 함수
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function handleLogin() {
    console.log("handleLogin()")
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    console.log(email, password)

    const response = await fetch('http://127.0.0.1:8000/user/login/', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    console.log(response)
    if (response.status == 200) {
        //response를 json화해서 access,refresh 가져옴
        const response_json = await response.json()
        console.log(response_json)

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        // 인증되어있는지 확인
        localStorage.setItem("payload", jsonPayload);
        const payload = localStorage.getItem("payload")
        const is_active = JSON.parse(payload).is_active
        console.log("is_active", is_active)
        if (is_active) {
            alert("환영합니다.")
            window.location.replace('index.html')
        }
    } else {
        alert("인증이 완료되지않았거나 가입되지않은 이메일입니다.")
    }
}



/**
 * 작성자 : 공민영
 * 내용 : 닉네임 가져와서 보여줌
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
async function showName() {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    console.log(payload_parse)

    const intro = document.getElementById("intro")


    // payload 에서 가져온 정보를 html에 보이게하기(id 이용)
    intro.innerText = payload_parse.nickname
}

/**
 * 작성자 : 공민영
 * 내용 : 로그인 로그아웃 시 버튼 바꾸기
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
document.addEventListener('DOMContentLoaded', function () {
    const get_access = localStorage.getItem('access');
    if (get_access) {
        document.getElementById('login_container').style.display = 'none';
    } else {
        document.getElementById('logged_in_container').style.display = 'none';
    }
});


/**
 * 작성자 : 공민영
 * 내용 : 로그아웃
 * 최초 작성일 : 2023.06.15
 * 업데이트 일자 : 2023.06.15
 */
function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}