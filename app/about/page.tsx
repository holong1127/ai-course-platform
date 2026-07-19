export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">關於 AI 辦公達人</h1>

      <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
        <p>
          AI 辦公達人係一門專為香港辦公室工作者而設嘅 AI 實戰課程。
          我哋相信 AI 唔應該剩係俾工程師用，每個 office 工嘅人都應該用得著。
        </p>
        <p>
          課程涵蓋 45 課，由安裝工具開始，到製作自動化工具、整合知識庫、
          操作 Excel、生成報表，一步步教你用 AI 提升工作效率。
        </p>
        <p>
          第一期內容以會計及財務工作場景為主，未來會擴展到 HR、行政、
          採購等其他工種。
        </p>
        <div className="rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4">
          <p className="text-sm text-primary-800">
            <strong>一個人 + AI = 辦公室團隊</strong>
            <br />
            唔需要請多個人，AI 幫你搞掂重複工作。
          </p>
        </div>
      </div>
    </div>
  );
}
