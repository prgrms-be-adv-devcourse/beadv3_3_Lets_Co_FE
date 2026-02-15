import type { AddressInfo } from "../addressInfo";
import type { CardInfo } from "../cardInfo";

export interface ManageUserDetailsResponse {
    id: string;
    lockedUntil: number;
    role: string;
    membership: string;
    agreeTermsAt: number;
    agreePrivacyAt: number;
    createdAt: number;
    updatedAt: number;
    mail: string;
    gender: string;
    balance: number;
    name: string;
    phoneNumber: string;
    birth: string;
    addressListDTO: AddressInfo[];
    CardListDTO: CardInfo[];
    agreeMarketingAt: number;
}


// private String id;
// private LocalDateTime lockedUntil;
// private UsersRole role;
// private UsersMembership membership;
// private LocalDateTime agreeTermsAt;
// private LocalDateTime agreePrivacyAt;
// private LocalDateTime createdAt;
// private LocalDateTime updatedAt;
// private String mail;
// private UsersInformationGender gender;
// private BigDecimal balance;
// private String name;
// private String phoneNumber;
// private String birth;
// private List<AddressListDTO> addressListDTO;
// private List<CardListDTO> cardListDTO;
// private LocalDateTime agreeMarketingAt;