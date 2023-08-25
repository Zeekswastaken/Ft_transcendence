"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDto = exports.update = exports.TO_update = exports.MoreInfos = exports.jwtDTO = exports.UserDto2 = exports.UserDto = void 0;
class UserDto {
    constructor() {
        this.avatar_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
        this.repassword = 'none';
        this.password = 'Oauth';
        this.username = '';
    }
}
exports.UserDto = UserDto;
class UserDto2 {
    constructor() {
        this.avatar_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU';
        this.password = 'Oauth';
        this.username = '';
    }
}
exports.UserDto2 = UserDto2;
class jwtDTO {
}
exports.jwtDTO = jwtDTO;
class MoreInfos {
    constructor() {
        this.id = -1;
    }
}
exports.MoreInfos = MoreInfos;
class TO_update {
    constructor() {
    }
}
exports.TO_update = TO_update;
class update {
    constructor() {
        this.privacy = true;
    }
}
exports.update = update;
class tokenDto {
}
exports.tokenDto = tokenDto;
//# sourceMappingURL=use.Dto.js.map