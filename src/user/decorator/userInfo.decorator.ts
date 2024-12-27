import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 데코레이터 정의의
export const UserInfo = createParamDecorator(

    // data: 데코레이터에 전달된 값(선택), ctx: 실행 컨텍스트로 현재 요텅에 대한 정보 제공
    (data: string | string[], ctx: ExecutionContext) => {

        // ctx에서 http 요청 객체(= request에서 가져옴) 추출
        const request = ctx.switchToHttp().getRequest();

        // user에 request에서 가져온 정보 저장 (여기서는 cookie에 저장된 jwt 토큰의 유저 정보)
        const user = request.user;

        if (!user) return null;

        // 여러 필드를 요청한 경우 객체로 반환하는 코드
        // data가 배열인지 확인
        if (Array.isArray(data)) {
            // reduce : data 배열의 요소를 순회하면서 결과를 누적한다
            // 여기서는 배열에 포함된 키에 해당하는 값을 user객체에서 가져와 acc에 축적
            return data.reduce((acc, key) => {
                acc[key] = user[key];
                return acc;
            }, {});
        }

        console.log("유저 데코레이터 " + user[data]);

        if (data) {
            return user[data];
        }
        return user;
    },
);