import { useEffect, useState } from "react";
import type { AddressResponse } from "../../types/response/addressResponse";
import type { UpsertAddressRequest } from "../../types/request/upsertAddressRequest";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../../api/userApi";

function Address() {

    const [loading, setLoading] = useState<boolean>(true);
    const [addressList, setAddressList] = useState<AddressResponse[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState({
        recipient: "",
        address: "",
        details: "",
        phone: ""
    });

    const [formData, setFormData] = useState({
        recipient: "",
        address: "",
        details: "",
        phone: ""
    });

    useEffect(() => {
        fetchAddressData();
    }, [])

    const fetchAddressData = async () => {
        try {
            const data = await getAddress();
            setAddressList(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // [핸들러] 신규 추가 입력
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // [핸들러] 수정 모드 입력
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // [기능] 수정 모드 진입
    const startEditing = (addr: AddressResponse) => {
        setEditingId(addr.addressCode);
        setEditFormData({
            recipient: addr.recipient,
            address: addr.address,
            details: addr.addressDetail,
            phone: addr.phoneNumber
        });
    };

    // [기능] 수정 취소
    const cancelEditing = () => {
        setEditingId(null);
        setEditFormData({ recipient: "", address: "", details: "", phone: "" });
    };

    // [기능] 수정 요청
    const handleUpdate = async (addressCode: string) => {
        const updateData = {
            addressCode: addressCode,
            recipient: editFormData.recipient,
            address: editFormData.address,
            addressDetail: editFormData.details,
            phoneNumber: editFormData.phone,
            defaultAddress: false
        };

        try {
            await updateAddress(updateData);
            console.log("수정 요청:", updateData); 
            
            alert("수정되었습니다.");
            setEditingId(null);
            fetchAddressData();
        } catch (error) {
            alert("수정 실패");
        }
    };

    // [기능] 신규 저장
    const handleSubmit = async () => {
        const addData: UpsertAddressRequest = {
            addressCode: formData.address,
            defaultAddress: false,
            recipient: formData.recipient,
            address: formData.address,
            addressDetail: formData.details,
            phoneNumber: formData.phone
        }

        try {
            await addAddress(addData);
            alert("주소가 저장되었습니다.");
            setFormData({ recipient: "", address: "", details: "", phone: "" });
            setShowForm(false);
            fetchAddressData();
        } catch (e) {
            alert("주소 추가 실패");
        }
    };

    // [기능] 삭제
    const handleDelete = async (code: string) => {
        if (!window.confirm("정말 이 주소를 삭제하시겠습니까?")) return;
        try {
            await deleteAddress({ addressCode: code });
            alert("삭제되었습니다.")
            fetchAddressData();
        } catch (error) {
            alert("주소 삭제 실패");
        }
    }

    if (loading) return <div>로딩 중입니다...</div>;

    return (
        <div>
            <h1>주소 목록</h1>

            {addressList.length > 0 ? (
                <div>
                    {addressList.map((addr) => {
                        const isEditing = editingId === addr.addressCode;

                        return (
                            <div key={addr.addressCode}>
                                {isEditing ? (
                                    <div>
                                        <div>
                                            <label>수령인: </label>
                                            <input name="recipient" value={editFormData.recipient} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>주소: </label>
                                            <input name="address" value={editFormData.address} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>상세: </label>
                                            <input name="details" value={editFormData.details} onChange={handleEditChange} />
                                        </div>
                                        <div>
                                            <label>연락처: </label>
                                            <input name="phone" value={editFormData.phone} onChange={handleEditChange} />
                                        </div>
                                        
                                        <div>
                                            <button onClick={() => handleUpdate(addr.addressCode)}>완료</button>
                                            <button onClick={cancelEditing}>취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div>
                                            <label>수령인: </label>
                                            <span>{addr.recipient}</span>
                                        </div>
                                        <div>
                                            <label>주소: </label>
                                            <span>{addr.address}</span>
                                        </div>
                                        <div>
                                            <label>상세주소: </label>
                                            <span>{addr.addressDetail}</span>
                                        </div>
                                        <div>
                                            <label>연락처: </label>
                                            <span>{addr.phoneNumber}</span>
                                        </div>
                                        
                                        <div>
                                            <button onClick={() => startEditing(addr)}>수정</button>
                                            <button onClick={() => handleDelete(addr.addressCode)}>삭제</button>
                                        </div>
                                    </div>
                                )}
                                <hr />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>등록된 주소 정보가 없습니다.</div>
            )}

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "취소" : "새 주소 추가하기"}
            </button>

            {showForm && (
                <div>
                    <h3>새 주소 입력</h3>
                    <div>
                        <label>수령인: </label>
                        <input name="recipient" value={formData.recipient} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>주소: </label>
                        <input name="address" value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>상세주소: </label>
                        <input name="details" value={formData.details} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>연락처: </label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="010-0000-0000" />
                    </div>
                    <button onClick={handleSubmit}>저장하기</button>
                </div>
            )}
        </div>
    );
}

export default Address;