import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        phone: "",
        defaultAddress: false
    });

    const [formData, setFormData] = useState({
        recipient: "",
        address: "",
        details: "",
        phone: "",
        defaultAddress: false 
    });

    useEffect(() => {
        fetchAddressData();
    }, []);

    const fetchAddressData = async () => {
        try {
            const response = await getAddress();
            if (response && response.resultCode === "SUCCESS") {
                setAddressList(response.data);
            } else {
                setAddressList([]);
            }
        } catch (error) {
            console.error("주소 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({ 
            ...editFormData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const startEditing = (addr: AddressResponse) => {
        setEditingId(addr.addressCode);
        setEditFormData({
            recipient: addr.recipient,
            address: addr.address,
            details: addr.addressDetail,
            phone: addr.phoneNumber,
            defaultAddress: addr.defaultAddress
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditFormData({ recipient: "", address: "", details: "", phone: "", defaultAddress: false });
    };

    const handleUpdate = async (addressCode: string) => {
        const updateData: UpsertAddressRequest = {
            addressCode: addressCode,
            recipient: editFormData.recipient,
            address: editFormData.address,
            addressDetail: editFormData.details,
            phoneNumber: editFormData.phone,
            defaultAddress: editFormData.defaultAddress
        };

        try {
            await updateAddress(updateData);
            alert("주소가 수정되었습니다.");
            setEditingId(null);
            fetchAddressData();
        } catch (error) {
            alert("수정 실패");
        }
    };

    const handleSubmit = async () => {
        const addData: UpsertAddressRequest = {
            addressCode: "", 
            defaultAddress: formData.defaultAddress,
            recipient: formData.recipient,
            address: formData.address,
            addressDetail: formData.details,
            phoneNumber: formData.phone
        };

        try {
            await addAddress(addData);
            alert("새 주소가 저장되었습니다.");
            setFormData({ recipient: "", address: "", details: "", phone: "", defaultAddress: false });
            setShowForm(false);
            fetchAddressData();
        } catch (e) {
            alert("주소 추가 실패");
        }
    };

    const handleDelete = async (code: string) => {
        if (!window.confirm("정말 이 주소를 삭제하시겠습니까?")) return;
        try {
            await deleteAddress({ addressCode: code });
            alert("삭제되었습니다.");
            fetchAddressData();
        } catch (error) {
            alert("주소 삭제 실패");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">주소지 관리</h1>
                <Link to="/my" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                    마이페이지로 돌아가기
                </Link>
            </div>

            <div className="space-y-4 mb-8">
                {addressList.length > 0 ? (
                    addressList.map((addr) => {
                        const isEditing = editingId === addr.addressCode;
                        return (
                            <div key={addr.addressCode} className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${addr.defaultAddress ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-100'}`}>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">수령인</label>
                                                <input name="recipient" value={editFormData.recipient} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">연락처</label>
                                                <input name="phone" value={editFormData.phone} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">주소</label>
                                            <input name="address" value={editFormData.address} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1">상세주소</label>
                                            <input name="details" value={editFormData.details} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <input type="checkbox" name="defaultAddress" id={`edit-def-${addr.addressCode}`} checked={editFormData.defaultAddress} onChange={handleEditChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <label htmlFor={`edit-def-${addr.addressCode}`} className="text-xs font-semibold text-gray-600">기본 배송지로 설정</label>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-2">
                                            <button onClick={() => handleUpdate(addr.addressCode)} className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-md hover:bg-gray-700">저장</button>
                                            <button onClick={cancelEditing} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-md hover:bg-gray-200">취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-800">{addr.recipient}</span>
                                                {addr.defaultAddress && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">DEFAULT</span>
                                                )}
                                                <span className="text-xs text-gray-400">|</span>
                                                <span className="text-sm text-gray-500">{addr.phoneNumber}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {addr.address}<br />
                                                <span className="text-gray-400">{addr.addressDetail}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button onClick={() => startEditing(addr)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">수정</button>
                                            <button onClick={() => handleDelete(addr.addressCode)} className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">삭제</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 font-medium">등록된 주소 정보가 없습니다.</p>
                    </div>
                )}
            </div>

            <button 
                onClick={() => setShowForm(!showForm)}
                className={`w-full py-4 rounded-xl font-bold border-2 transition-all ${
                    showForm ? "bg-white border-gray-200 text-gray-500" : "bg-white border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                }`}
            >
                {showForm ? "취소하기" : "+ 새 주소 추가하기"}
            </button>

            {showForm && (
                <div className="mt-6 bg-white rounded-xl shadow-md border border-blue-100 p-8 space-y-5 animate-in fade-in duration-300">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3">새 배송지 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">수령인</label>
                            <input name="recipient" value={formData.recipient} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="이름" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">연락처</label>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="010-0000-0000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">주소</label>
                        <input name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="도로명 또는 지번 주소" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">상세주소</label>
                        <input name="details" value={formData.details} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="상세 정보" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" name="defaultAddress" id="new-def" checked={formData.defaultAddress} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="new-def" className="text-xs font-semibold text-gray-600">이 주소를 기본 배송지로 설정</label>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-gray-800 text-white py-3.5 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-sm mt-2"
                    >
                        배송지 저장하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default Address;