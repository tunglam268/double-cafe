export enum UserStatusEnum {
  DEACTIVATE = 'DEACTIVATE',
  ACTIVE = 'ACTIVE',
}

export enum MessageEnum {
  CREATE_SUCCESS = 'Tạo người dùng thành công',
  LOGIN_SUCCESS = 'Đăng nhập thành công',
  TOKEN_EXPIRED = 'Token đã hết hạn',
  PHONE_NUMBER_DUPLICATE = 'Số điện thoại đã tồn tại trong hệ thống',
  USERNAME_DUPLICATE = 'Tên người dùng đã tồn tại trong hệ thống',
  TOKEN_EMPTY = 'Access Token đang để trống',
  TOKEN_INVALID = 'Token sai hoặc hết hạn',
  USER_NOT_FOUND = 'Không tìm thấy người dùng',
  USERNAME_PASSWORD_EMPTY = 'Tên đăng nhập và mật khẩu đang để trống',
  USERNAME_PASSWORD_WRONG = 'Tên đăng nhập và mật khẩu sai',
  NO_PERMISSION = 'Bạn không có quyền sử dụng chức năng này',
}
