import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";

const REGIONS = ["전체 지역", "서울특별시", "부산광역시", "대구광역시", "인천광역시", "경기도", "강원도", "충청남도", "전라남도", "경상남도", "제주도"];
const INDUSTRIES = ["전체 업종", "음식점업", "카페/음료", "의류/패션", "뷰티/미용", "교육/학원", "IT/소프트웨어", "제조업", "도소매업"];
const CATEGORIES = ["전체 카테고리", "창업 지원", "자금 지원", "세금 감면", "인건비 지원", "임차료 지원", "교육/컨설팅"];
const SORT_OPTIONS = ["관련도 높은순", "최신순", "마감임박순"];

const CATEGORY_COLORS: Record<string, string> = {
  "최저임금": "bg-gray-100 text-gray-600",
  "노동·복지": "bg-blue-100 text-blue-700",
  "대출·자금": "bg-indigo-100 text-indigo-700",
  "에너지": "bg-orange-100 text-orange-700",
  "디지털": "bg-violet-100 text-violet-700",
  "세금": "bg-green-100 text-green-700",
  "창업지원": "bg-emerald-100 text-emerald-700",
  "임차료": "bg-pink-100 text-pink-700",
  "교육": "bg-sky-100 text-sky-700",
};

interface Policy {
  id: number;
  category: string;
  filterCategory: string;
  region: string;   // "전국" or specific region
  industry: string; // "전체" or specific industry
  isAIRecommended: boolean;
  title: string;
  description: string;
  relevance: number;
  agency: string;
  date: string;
}

const MOCK_POLICIES: Policy[] = [
  {
    id: 1,
    category: "최저임금",
    filterCategory: "인건비 지원",
    region: "전국",
    industry: "전체",
    isAIRecommended: true,
    title: "2026년 최저임금 인상에 따른 소상공인 인건비 부담 완화 지원",
    description: "최저임금 1만 30원 적용에 따라 소규모 사업장 인건비 부담이 증가합니다. 일자리 안정자금 및 사회보험료 지원을 통해 실질적인 비용 절감이 가능합니다.",
    relevance: 92,
    agency: "고용노동부",
    date: "2026.01.15",
  },
  {
    id: 2,
    category: "노동·복지",
    filterCategory: "인건비 지원",
    region: "전국",
    industry: "전체",
    isAIRecommended: true,
    title: "사회보험료 지원 확대 — 고용보험·국민연금 사업주 부담 경감",
    description: "10인 미만 소규모 사업체 사업주의 고용보험 및 국민연금 부담분을 최대 80% 지원합니다. 월 지원액 최대 8만원.",
    relevance: 88,
    agency: "고용노동부",
    date: "2026.01.20",
  },
  {
    id: 3,
    category: "대출·자금",
    filterCategory: "자금 지원",
    region: "전국",
    industry: "전체",
    isAIRecommended: true,
    title: "소상공인 경영안정자금 대출 한도 확대 및 금리 인하",
    description: "소상공인시장진흥공단에서 운영하는 경영안정자금의 대출 한도가 기존 2천만원에서 3천만원으로 확대되며, 연 2.5% 고정금리 적용.",
    relevance: 85,
    agency: "중소벤처기업부",
    date: "2026.02.03",
  },
  {
    id: 4,
    category: "에너지",
    filterCategory: "자금 지원",
    region: "서울특별시",
    industry: "음식점업",
    isAIRecommended: false,
    title: "소상공인 전기료·가스비 절감 에너지 바우처 2026년 확대 시행",
    description: "음식업·소매업 소상공인을 대상으로 에너지 효율화 설비 구축 비용의 최대 80%를 지원합니다. 1인당 지원 한도 500만원.",
    relevance: 78,
    agency: "산업통상자원부",
    date: "2026.01.28",
  },
  {
    id: 5,
    category: "디지털",
    filterCategory: "창업 지원",
    region: "전국",
    industry: "도소매업",
    isAIRecommended: false,
    title: "소상공인 디지털 전환 바우처 — 키오스크·POS·배달앱 비용 지원",
    description: "매장 디지털화를 위한 키오스크, POS 시스템 도입 비용을 최대 400만원까지 지원합니다. 2026년 상반기 선착순 접수.",
    relevance: 74,
    agency: "중소벤처기업부",
    date: "2026.02.10",
  },
  {
    id: 6,
    category: "세금",
    filterCategory: "세금 감면",
    region: "전국",
    industry: "전체",
    isAIRecommended: false,
    title: "2026 간이과세자 기준 상향 — 연매출 1억 400만원으로 확대",
    description: "간이과세자 기준이 연매출 8,000만원에서 1억 400만원으로 상향되어 더 많은 소상공인이 간편한 세금 신고를 이용할 수 있게 됩니다.",
    relevance: 70,
    agency: "기획재정부",
    date: "2026.01.05",
  },
  {
    id: 7,
    category: "창업지원",
    filterCategory: "창업 지원",
    region: "경기도",
    industry: "전체",
    isAIRecommended: false,
    title: "소상공인 창업 패키지 지원 — 초기 창업비용 최대 1천만원 지원",
    description: "예비 창업자 및 창업 1년 이내 소상공인을 대상으로 초기 사업화 자금 및 멘토링을 지원합니다.",
    relevance: 65,
    agency: "중소벤처기업부",
    date: "2026.03.01",
  },
  {
    id: 8,
    category: "임차료",
    filterCategory: "임차료 지원",
    region: "서울특별시",
    industry: "전체",
    isAIRecommended: false,
    title: "소상공인 임차료 부담 경감 — 착한 임대인 세액공제 확대",
    description: "임대료를 자발적으로 인하한 임대인에게 인하액의 70%를 세액공제하는 제도가 확대 시행됩니다.",
    relevance: 62,
    agency: "국세청",
    date: "2026.02.20",
  },
  {
    id: 9,
    category: "교육",
    filterCategory: "교육/컨설팅",
    region: "전국",
    industry: "전체",
    isAIRecommended: false,
    title: "소상공인 경영역량 강화 교육 — 온라인 무료 과정 100종 제공",
    description: "마케팅, 세무, 인사관리 등 경영 전반에 걸친 온라인 교육 과정을 무료로 제공합니다. 수료 시 수강증 발급.",
    relevance: 58,
    agency: "소상공인시장진흥공단",
    date: "2026.01.10",
  },
  {
    id: 10,
    category: "디지털",
    filterCategory: "창업 지원",
    region: "부산광역시",
    industry: "도소매업",
    isAIRecommended: false,
    title: "전통시장 스마트화 지원 — Wi-Fi·CCTV·무인결제 인프라 구축",
    description: "전통시장 내 스마트 인프라 구축을 위한 설비 비용을 최대 90% 지원합니다. 시장 단위로 신청 가능.",
    relevance: 55,
    agency: "중소벤처기업부",
    date: "2026.03.15",
  },
  {
    id: 11,
    category: "노동·복지",
    filterCategory: "인건비 지원",
    region: "전국",
    industry: "전체",
    isAIRecommended: false,
    title: "소상공인 고용보험 특례 가입 — 자영업자 실업급여 수급 확대",
    description: "자영업자 고용보험 특례 가입 대상이 확대되어 폐업 시 실업급여를 받을 수 있는 소상공인이 늘어납니다.",
    relevance: 52,
    agency: "고용노동부",
    date: "2026.02.15",
  },
  {
    id: 12,
    category: "대출·자금",
    filterCategory: "자금 지원",
    region: "전국",
    industry: "전체",
    isAIRecommended: false,
    title: "소상공인 긴급경영안정자금 — 재난·재해 피해 업체 우선 지원",
    description: "재난 및 재해로 피해를 입은 소상공인에게 긴급 경영안정자금을 우선 지원합니다. 최대 5천만원, 연 1.5%.",
    relevance: 48,
    agency: "소상공인시장진흥공단",
    date: "2026.01.25",
  },
];

const PER_PAGE = 6;

function PolicyCard({ policy }: { policy: Policy }) {
  const categoryColor = CATEGORY_COLORS[policy.category] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
          {policy.category}
        </span>
        {policy.isAIRecommended && (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-600">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FBBF24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI 추천
          </span>
        )}
      </div>

      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{policy.title}</h3>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{policy.description}</p>

      <div className="flex items-end justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${policy.relevance}%` }} />
          </div>
          <span className="text-xs font-medium text-primary-600">관련도 {policy.relevance}%</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{policy.agency}</p>
          <p className="text-xs text-gray-400">{policy.date}</p>
        </div>
      </div>
    </div>
  );
}

export default function Policies() {
  const [region, setRegion] = useState("전체 지역");
  const [industry, setIndustry] = useState("전체 업종");
  const [category, setCategory] = useState("전체 카테고리");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("관련도 높은순");
  const [page, setPage] = useState(1);

  function handleFilter(setter: (v: string) => void) {
    return (v: string) => { setter(v); setPage(1); };
  }

  function handleReset() {
    setRegion("전체 지역");
    setIndustry("전체 업종");
    setCategory("전체 카테고리");
    setQuery("");
    setPage(1);
  }

  const filtered = MOCK_POLICIES.filter(p => {
    if (region !== "전체 지역" && p.region !== "전국" && p.region !== region) return false;
    if (industry !== "전체 업종" && p.industry !== "전체" && p.industry !== industry) return false;
    if (category !== "전체 카테고리" && p.filterCategory !== category) return false;
    if (query && !p.title.includes(query) && !p.description.includes(query)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "관련도 높은순") return b.relevance - a.relevance;
    if (sort === "최신순") return b.date.localeCompare(a.date);
    if (sort === "마감임박순") return a.date.localeCompare(b.date);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="bg-primary-100 px-40 pt-25">
        <p className="text-sm font-semibold text-primary-600">AI 맞춤 추천</p>
        <h4 className="text-3xl font-bold mt-3">정책 모아보기</h4>
        <p className="text-base mt-3 text-gray-500 pb-10">내 사업 조건에 맞는 정책을 한 곳에서 찾아보세요. 업종·지역·키워드로 필터링할 수 있어요.</p>
      </div>

      <div className="px-40 border border-x-0 border-gray-200 py-4 flex items-center gap-3">
        <Dropdown value={region}   onChange={handleFilter(setRegion)}   options={REGIONS} />
        <Dropdown value={industry} onChange={handleFilter(setIndustry)} options={INDUSTRIES} />
        <Dropdown value={category} onChange={handleFilter(setCategory)} options={CATEGORIES} />

        <div className="flex-1 flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-primary-400 transition-colors bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="정책명, 지원금명으로 검색..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          초기화
        </button>
      </div>

      <div className="px-40 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">총 <span className="font-semibold text-gray-900">{sorted.length}개</span>의 정책이 있어요</p>
          <Dropdown value={sort} onChange={handleFilter(setSort)} options={SORT_OPTIONS} />
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sm">조건에 맞는 정책이 없어요</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {paged.map(policy => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      p === page ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-lg leading-none"
                  >
                    ›
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
