import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';

const terms: JSX.Element = (
  <div className="text-font-color text-12px-m md:text-14px font-normal tracking-0.24px md:tracking-0.28px">
    <div className='text-16px font-bold'>제 1장 총직</div><br />
    <div className='font-bold'>제 1조 (목적)</div>
    {splitCommentWithSlash(
      '본 약관은 Colour Inside 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리와 의무, 책임사항, 서비스 이용조건 및 절차 등을 규정함을 목적으로 합니다.'
    ).map((line, index) => (
      <p key={`1-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 2조 (정의)</div>
    {splitCommentWithSlash(
      '1. "서비스"란 회사가 제공하는 감정 기록 및 분석 플랫폼을 의미합니다./2. "이용자"란 비회원 및 회원을 포함하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 의미합니다./3. "비회원"이란 회원으로 가입하지 않고 회사가 제공하는 일부 서비스를 이용하는 자를 의미합니다./4. "회원"이란 회사와 서비스 이용계약을 체결하고 회원 계정을 생성하여 서비스를 이용하는 자를 의미합니다.'
    ).map((line, index) => (
      <p key={`2-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 3 조 (약관의 효력 및 변경)</div>
    {splitCommentWithSlash(
      '1. 본 약관은 이용자가 동의함으로써 효력이 발생합니다./2. 회사는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공지됩니다./3. 변경된 약관에 대해 동의하지 않는 경우, 이용자는 서비스 이용을 중단하고 탈퇴할 수 있습니다.'
    ).map((line, index) => (
      <p key={`3-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold text-16px'>제 2 장 비회원 이용약관</div><br />
    <div className='font-bold'>제 4 조 (비회원의 서비스 이용)</div>
    {splitCommentWithSlash(
      '1. 비회원은 회원가입 절차 없이 무료로 제공되는 서비스의 일부를 이용할 수 있습니다./2. 비회원이 이용할 수 있는 서비스의 범위는 회사의 정책에 따라 변경될 수 있습니다.'
    ).map((line, index) => (
      <p key={`4-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 5 조 (비회원의 의무)</div>
    {splitCommentWithSlash(
      '1. 비회원은 서비스 이용 시 법령 및 본 약관을 준수하여야 하며, 회사의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다./2. 비회원은 본 약관 및 관련 법령을 위반하여 발생하는 모든 책임을 부담합니다.'
    ).map((line, index) => (
      <p key={`5-${index}`}>{line}</p>
    ))}
    <br />
    <div className='font-bold'>제 6 조 (비회원 정보의 수집 및 보호)</div>
    {splitCommentWithSlash(
      '1. 회사는 비회원의 개인정보를 수집하지 않습니다. 단, 서비스 이용 과정에서 자동으로 수집되는 정보는 예외로 합니다./2. 회사는 비회원의 개인정보를 보호하기 위해 최선을 다합니다.'
    ).map((line, index) => (
      <p key={`6-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold text-16px'>제 3 장 회원 이용약관</div><br />
    <div className='font-bold'>제 7 조 (회원가입)</div>
    {splitCommentWithSlash(
      '1. 회원가입은 이용자가 본 약관에 동의하고, 회사가 정한 절차에 따라 회원 정보를 기입한 후 가입신청을 완료함으로써 이루어집니다./2. 회사는 필요 시 회원가입을 거부할 수 있으며, 이에 대한 이유는 개별 통지합니다.'
    ).map((line, index) => (
      <p key={`7-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 8 조 (회원의 의무)</div>
    {splitCommentWithSlash(
      '1. 회원은 본 약관 및 회사가 공지하는 사항을 준수하여야 합니다./2. 회원은 본인의 계정 정보 관리를 철저히 하여야 하며, 계정 정보를 제3자에게 양도하거나 대여할 수 없습니다./3. 회원은 서비스 이용 시 법령을 준수하고, 타인의 권리를 침해하지 않으며, 회사의 정상적인 운영을 방해하지 않습니다.'
    ).map((line, index) => (
      <p key={`8-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 9 조 (서비스의 제공 및 변경)</div>
    {splitCommentWithSlash(
      '1. 회사는 회원에게 다양한 서비스를 제공하며, 필요 시 서비스의 내용을 변경할 수 있습니다./2. 서비스 내용이 변경되는 경우, 회사는 변경 사항을 사전에 공지합니다.'
    ).map((line, index) => (
      <p key={`9-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 10 조 (회원 탈퇴 및 자격 상실)</div>
    {splitCommentWithSlash(
      '1. 회원은 언제든지 탈퇴 신청을 할 수 있으며, 회사는 즉시 회원 탈퇴를 처리합니다./2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원 자격을 제한하거나 상실시킬 수 있습니다./3. 가입 신청 시 허위 내용을 등록한 경우/다른 회원의 서비스 이용을 방해하거나 정보를 도용하는 경우/4. 법령 또는 본 약관을 위반하는 행위를 하는 경우'
    ).map((line, index) => (
      <p key={`10-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 11 조 (회원 정보의 수집 및 보호)</div>
    {splitCommentWithSlash(
      '1. 회사는 서비스 제공을 위해 필요한 최소한의 회원 정보를 수집할 수 있습니다./2. 회사는 회원의 개인정보를 보호하기 위해 최선을 다하며, 개인정보 보호정책에 따라 회원 정보를 관리합니다.'
    ).map((line, index) => (
      <p key={`11-${index}`}>{line}</p>
    ))}
    <br />

    <div className='text-16px font-bold'>제 4 장 기타</div><br />
    <div className='font-bold'>제 12 조 (면책 조항)</div>
    {splitCommentWithSlash(
      '1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중단 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우, 이에 대한 책임을 지지 않습니다./2. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.'
    ).map((line, index) => (
      <p key={`12-${index}`}>{line}</p>
    ))}
    <br />

    <div className='font-bold'>제 13 조 (분쟁 해결)</div>
    {splitCommentWithSlash(
      '1. 회사와 이용자 간에 발생한 분쟁에 대하여는 상호 협의를 통해 해결합니다./2. 분쟁이 해결되지 않는 경우, 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.'
    ).map((line, index) => (
      <p key={`13-${index}`}>{line}</p>
    ))}
  </div>
);


export default terms;
