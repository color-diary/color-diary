"use client"
import terms from '@/data/terms';
import Button from '../common/Button';
import Input from '../common/Input';
import { ChangeEvent, useState } from 'react';
import { InputStateType } from '@/types/input.type';
import Dropdown from '../common/modal/DropDown';
import Textarea from '../common/textarea';

interface MypageServiceModalProps {

    onClose: () => void;
}

const MypageServiceModal = ({ onClose }: MypageServiceModalProps) => {
    const [email, setEmail] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isOpenTerms, setIsOpenTerms] = useState<boolean>(false);
    const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
    const [emailState, setEmailState] = useState<InputStateType>('default');
    const [nicknameState, setNicknameState] = useState<InputStateType>('default');
    const [passwordState, setPasswordState] = useState<InputStateType>('default');
    const [confirmPasswordState, setConfirmPasswordState] = useState<InputStateType>('default');
    const [dropdownValue, setDropdownValue] = useState<string>('');
    const [text, setText] = useState('');
    const [textState, setTextState] = useState<'default' | 'filled' | 'error' | 'disable'>('default');


    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        const newEmail = e.target.value;

        setEmail(newEmail);
        setEmailState(() => {
            if (newEmail === '') return 'default';
            else {
                if (!validateEmail(newEmail)) return 'error';
                else return 'filled';
            }
        });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };

    const dropdownOptions = ['기능 문의', '버그 신고', '계정 관련 문의', '피드백 및 제안'];

    return (
        <div className="flex flex-col justify-center items-center gap-32px-col px-96px-row py-72px-col rounded-5xl bg-sign-up border-4 border-border-color">
            <h1 className="text-font-color text-24px font-bold tracking-0.48px">문의하기</h1>
            {/* 여기에 내용넣기 */}
            <Input
                type="email"
                state={emailState}
                value={email}
                setValue={setEmail}
                onChange={handleChangeEmail}
                label="답변받을 이메일을 입력해주세요."
                validationMessage="ex)abcd@gmail.com"
                placeholder="이메일을 입력해주세요."
            />

            <Dropdown // 드롭다운 컴포넌트 추가
                label="문의 종류를 선택해주세요."
                value={dropdownValue}
                setValue={setDropdownValue}
                options={dropdownOptions}
            />

            <Textarea
                label="문의사항을 작성해주세요."
                state={textState}
                value={text}
                setValue={setText}
                maxLength={500}
                placeholder="문의하실 내용을 작성해주세요."
            />
            <div className="w-full flex items-end justify-end self-stretch gap-16px-row">
                <Button
                    priority="secondary"
                    size={'lg'}
                    onClick={onClose}
                    icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.089 4.21606L4.146 4.14606C4.22886 4.06339 4.33809 4.0124 4.45468 4.00198C4.57126 3.99157 4.6878 4.02238 4.784 4.08906L4.854 4.14606L10 9.29306L15.146 4.14606C15.2289 4.06339 15.3381 4.0124 15.4547 4.00198C15.5713 3.99157 15.6878 4.02238 15.784 4.08906L15.854 4.14606C15.9367 4.22892 15.9877 4.33815 15.9981 4.45474C16.0085 4.57132 15.9777 4.68786 15.911 4.78406L15.854 4.85406L10.707 10.0001L15.854 15.1461C15.9367 15.2289 15.9877 15.3382 15.9981 15.4547C16.0085 15.5713 15.9777 15.6879 15.911 15.7841L15.854 15.8541C15.7711 15.9367 15.6619 15.9877 15.5453 15.9981C15.4287 16.0086 15.3122 15.9777 15.216 15.9111L15.146 15.8541L10 10.7071L4.854 15.8541C4.77115 15.9367 4.66191 15.9877 4.54533 15.9981C4.42874 16.0086 4.3122 15.9777 4.216 15.9111L4.146 15.8541C4.06333 15.7712 4.01234 15.662 4.00192 15.5454C3.99151 15.4288 4.02232 15.3123 4.089 15.2161L4.146 15.1461L9.293 10.0001L4.146 4.85406C4.06333 4.77121 4.01234 4.66197 4.00192 4.54539C3.99151 4.4288 4.02232 4.31226 4.089 4.21606Z" fill="#25B18C" />
                    </svg>

                    }
                >
                    문의사항 취소하기
                </Button>
                <Button
                    size={'lg'}
                    onClick={onClose}
                    icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="icon/mail">
                            <path id="Vector" d="M15.5 4C16.163 4 16.7989 4.26339 17.2678 4.73223C17.7366 5.20107 18 5.83696 18 6.5V14.5C18 15.163 17.7366 15.7989 17.2678 16.2678C16.7989 16.7366 16.163 17 15.5 17H4.5C3.83696 17 3.20107 16.7366 2.73223 16.2678C2.26339 15.7989 2 15.163 2 14.5V6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H15.5ZM17 7.961L10.254 11.931C10.1902 11.9684 10.1189 11.9913 10.0453 11.9978C9.9716 12.0044 9.8974 11.9946 9.828 11.969L9.746 11.931L3 7.963V14.5C3 14.8978 3.15804 15.2794 3.43934 15.5607C3.72064 15.842 4.10218 16 4.5 16H15.5C15.8978 16 16.2794 15.842 16.5607 15.5607C16.842 15.2794 17 14.8978 17 14.5V7.961ZM15.5 5H4.5C4.10218 5 3.72064 5.15804 3.43934 5.43934C3.15804 5.72064 3 6.10218 3 6.5V6.802L10 10.92L17 6.8V6.5C17 6.10218 16.842 5.72064 16.5607 5.43934C16.2794 5.15804 15.8978 5 15.5 5Z" fill="white" />
                        </g>
                    </svg>

                    }
                >
                    문의사항 보내기
                </Button>

            </div>
        </div>
    );
};

export default MypageServiceModal;
