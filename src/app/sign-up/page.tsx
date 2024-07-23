"use client";

import axios from "axios";
import { useState } from "react";

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const signUpHandler = async () => {
        const data = { email, password, nickname };

        try {
            const response = await axios.post("/api/auth/sign-up", data);

            if (response.status === 200) {
                alert('가입 성공');
                console.log('가입 성공')
                console.log(data);
            }
        } catch (error) {
            alert('가입 실패');
            console.log('가입 실패')
        }
    }

    return (
        <div>
            <div>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
            </div>
            <div>
                <button onClick={signUpHandler}>등록</button>
            </div>
        </div>
    );
}

export default SignUpPage;
