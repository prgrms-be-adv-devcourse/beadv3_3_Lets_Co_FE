import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { UserProfileResponse } from "../../types/response/userProfileResponse";
import { profile } from "../../api/userApi";

export default function Profile() {

    const [userProfile, setProfile] = useState<UserProfileResponse | null> (null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await profile();
                setProfile(data);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
                alert("정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!userProfile) { 
        return <div>회원 정보를 찾을 수 없습니다.</div>; 
    }

    return (
        <div>
            <h1>내정보</h1>
            
            <div>
                <div>
                    <span>성함:</span>
                    <span>{userProfile.name}</span>
                </div>

                <div>
                    <span>핸드폰:</span>
                    <span>{userProfile.phoneNumber}</span>
                </div>

                <div>
                    <span>생년월일:</span>
                    <span>{userProfile.birth}</span>
                </div>

                <div>
                    <span>등급:</span>
                    <span>{userProfile.grade}</span>
                </div>
            </div>

            <Link to="/my">마이페이지</Link>
        </div>
    );
} 