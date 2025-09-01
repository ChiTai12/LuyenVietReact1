import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { readJSON, writeJSON, cleanupLocalStorage } from "../utils/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth states
  const [currentUser, setCurrentUser] = useState(() =>
    readJSON("current_user", { id: "guest", name: "Khách" })
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    readJSON("is_authenticated", false)
  );
  const [users, setUsers] = useState(() => readJSON("users", []));

  // App states
  const [posts, setPosts] = useState(() =>
    readJSON("posts", [
      {
        id: "1",
        title: "Vận động viên Shader - Ngôi sao mới của làng thể thao Việt Nam",
        category: "Thể thao",
        content:
          "Với đôi chân thiên tài và kỹ thuật điêu luyện, Shader đang dần trở thành tâm điểm chú ý. Không chỉ bởi những màn trình diễn ấn tượng trên sân cỏ, mà còn bởi tinh thần thi đấu kiên cường và sự khiêm tốn hiếm có. Từ một cậu bé nghèo ở vùng quê, Shader đã vượt qua biết bao khó khăn để có được vị trí như hôm nay.\n\nShader sinh ra trong một gia đình nông dân nghèo ở tỉnh An Giang. Từ nhỏ, cậu đã thể hiện tài năng bóng đá đặc biệt khi chơi cùng những đứa trẻ trong làng. Với một quả bóng da cũ kỹ, Shader đã luyện tập không ngừng nghỉ trên những cánh đồng lúa.\n\nBước ngoặt trong cuộc đời Shader đến khi cậu 15 tuổi. Một huấn luyện viên của câu lạc bộ thanh niên tỉnh đã phát hiện ra tài năng của cậu trong một giải đấu địa phương. Từ đó, hành trình chinh phục ước mơ bóng đá chuyên nghiệp của Shader chính thức bắt đầu.\n\nTrong 3 năm qua, Shader đã ghi được 45 bàn thắng và có 23 đường kiến tạo cho đội tuyển U23 Việt Nam. Đặc biệt, màn trình diễn của cậu trong trận chung kết SEA Games 32 đã để lại ấn tượng sâu sắc với người hâm mộ khắp Đông Nam Á.\n\nHLV Park Hang-seo nhận xét: 'Shader là một cầu thủ có tài năng thiên bẩm hiếm có. Cậu ấy không chỉ có kỹ thuật cá nhân xuất sắc mà còn có tầm nhìn chiến thuật rất tốt. Điều quan trọng nhất là tinh thần học hỏi và cống hiến hết mình cho đội tuyển.'\n\nHiện tại, nhiều câu lạc bộ lớn ở châu Âu đã bắt đầu quan tâm đến Shader. Theo nguồn tin từ ban lãnh đạo VFF, đã có ít nhất 3 đội bóng tại Premier League và La Liga gửi thư mời thử việc. Tuy nhiên, Shader vẫn muốn tiếp tục cống hiến cho bóng đá Việt Nam ít nhất 2 năm nữa.\n\n'Tôi sinh ra và lớn lên trên mảnh đất Việt Nam. Ước mơ lớn nhất của tôi là giúp đội tuyển quốc gia giành được những thành tích cao nhất có thể. Châu Âu luôn là giấc mơ, nhưng hiện tại tôi chỉ tập trung vào việc phát triển bản thân và cống hiến cho đội tuyển,' Shader chia sẻ trong buổi phỏng vấn độc quyền.\n\nVới tài năng và sự nỗ lực không ngừng, Shader hứa hẹn sẽ trở thành niềm tự hào của bóng đá Việt Nam trong những năm tới.",
        excerpt:
          "Shader - tài năng bóng đá mới nổi từ An Giang đang thu hút sự chú ý của các CLB châu Âu với 45 bàn thắng cho U23 Việt Nam.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center",
        createdAt: new Date().toISOString(),
        author: {
          id: "1",
          name: "Nguyễn Thể Thao",
          avatarUrl: "https://i.pravatar.cc/150?img=1",
        },
        tags: ["thể thao", "vn", "shader"],
        comments: [],
      },
      {
        id: "2",
        title: "Căn cước công dân gắn chip: Bước tiến mới trong công nghệ số",
        category: "Công nghệ",
        content:
          "Việc triển khai căn cước công dân gắn chip đánh dấu một bước tiến quan trọng trong việc số hóa các dịch vụ công. Với công nghệ hiện đại, thẻ căn cước mới không chỉ chứa thông tin cá nhân mà còn tích hợp nhiều tính năng thông minh, giúp người dân thực hiện các giao dịch một cách nhanh chóng và an toàn hơn.\n\nTheo thông tin từ Bộ Công an, từ ngày 1/1/2025, toàn bộ hệ thống căn cước công dân gắn chip đã được triển khai rộng rãi trên cả nước. Chip NFC tích hợp trong thẻ có khả năng lưu trữ thông tin sinh trắc học như vân tay, mống mắt và dữ liệu khuôn mặt với độ bảo mật cực cao.\n\nMột trong những ưu điểm nổi bật của công nghệ này là khả năng xác thực danh tính không tiếp xúc. Người dân chỉ cần đưa thẻ lại gần thiết bị đọc trong vòng 5cm là có thể thực hiện các giao dịch như rút tiền, đăng ký khám bệnh, hoặc làm thủ tục hành chính.\n\nTS. Nguyễn Văn Minh, chuyên gia an ninh mạng tại Đại học Bách Khoa Hà Nội, nhận định: 'Công nghệ chip NFC được sử dụng trong CCCD có mức độ bảo mật tương đương với thẻ ngân hàng quốc tế. Dữ liệu được mã hóa AES-256 và có cơ chế chống sao chép, làm giả rất hiệu quả.'\n\nTính đến nay, đã có hơn 68 triệu công dân Việt Nam được cấp CCCD gắn chip. Các ngân hàng lớn như Vietcombank, VietinBank, BIDV đã tích hợp hệ thống xác thực qua CCCD chip, giúp rút ngắn thời gian mở tài khoản từ 30 phút xuống còn 5 phút.\n\nBên cạnh đó, ứng dụng VNeID - ứng dụng định danh điện tử quốc gia - đã được tải về hơn 45 triệu lượt. Ứng dụng này cho phép người dân lưu trữ thông tin CCCD điện tử trên điện thoại và sử dụng để thực hiện các giao dịch trực tuyến một cách an toàn.\n\nỞ các cơ quan hành chính nhà nước, việc sử dụng CCCD gắn chip đã giúp giảm thời gian xử lý hồ sơ trung bình 40%. Nhiều thủ tục như đăng ký kinh doanh, cấp giấy phép lái xe, đăng ký kết hôn đã được số hóa hoàn toàn.\n\nDự kiến trong năm 2025, Chính phủ sẽ tiếp tục mở rộng các dịch vụ tích hợp với CCCD gắn chip, bao gồm thanh toán điện tử, bỏ phiếu điện tử và hệ thống y tế thông minh. Đây được xem là nền tảng quan trọng để xây dựng chính phủ số và xã hội số trong tương lai.",
        excerpt:
          "CCCD gắn chip NFC chính thức triển khai toàn quốc, rút ngắn thời gian giao dịch và tăng cường bảo mật AES-256.",
        thumbnailUrl:
          "https://us-en-cdn.square.ncms.io/content/uploads/2023/04/NFC-Guide-Managing-Your-Finances.jpg.jpeg",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        author: {
          id: "2",
          name: "Trần Công Nghệ",
          avatarUrl: "https://i.pravatar.cc/150?img=2",
        },
        tags: ["công nghệ", "cccd", "số hóa"],
        comments: [],
      },
      {
        id: "3",
        title: "Thị trường bất động sản Q4/2024: Nhiều cơ hội đầu tư hấp dẫn",
        category: "Kinh doanh",
        content:
          "Bước vào quý cuối năm 2024, thị trường bất động sản đang có những tín hiệu tích cực. Các chuyên gia dự báo sẽ có nhiều dự án mới được triển khai, tạo ra những cơ hội đầu tư hấp dẫn cho người mua. Đặc biệt, phân khúc nhà ở xã hội và căn hộ cao cấp đang được quan tâm đặc biệt.\n\nTheo báo cáo từ Hiệp hội Bất động sản Việt Nam (VNREA), giao dịch bất động sản trong 9 tháng đầu năm 2024 đã tăng 23% so với cùng kỳ năm trước. Riêng tại TP.HCM, lượng giao dịch căn hộ chung cư đã vượt mốc 45.000 căn, cao nhất trong 5 năm qua.\n\nÔng Nguyễn Hoàng Nam, Tổng Giám đốc Công ty Tư vấn Đầu tư BĐS Savills Việt Nam, nhận định: 'Thị trường đang trong giai đoạn phục hồi mạnh mẽ. Nguồn cung mới tăng, thanh khoản được cải thiện và giá cả ổn định hơn so với giai đoạn 2022-2023.'\n\nMột trong những yếu tố thúc đẩy thị trường là việc Chính phủ ban hành nhiều chính sách hỗ trợ. Gói tín dụng ưu đãi 120.000 tỷ đồng cho vay mua nhà ở xã hội với lãi suất chỉ 6.5%/năm đã thu hút hàng ngàn khách hàng đăng ký.\n\nTại khu vực phía Bắc, các dự án tại Hà Nội và vùng ven như Hưng Yên, Bắc Ninh đang dẫn đầu về mức độ quan tâm. Dự án Vinhomes Grand Park tại TP. Thủ Đức đã bán hết 2.000 căn hộ chỉ trong 3 tháng đầu năm.\n\nPhân khúc biệt thự và nhà phố cao cấp cũng có sự bứt phá mạnh mẽ. Giá bán trung bình tại các khu vực trung tâm đã tăng 15-20% so với đầu năm, nhưng vẫn thu hút được lượng lớn nhà đầu tư có tài chính mạnh.\n\nBà Lê Thị Minh Châu, Giám đốc Marketing tại Công ty Phát triển Đô thị Vingroup, chia sẻ: 'Chúng tôi đang đẩy mạnh phát triển các dự án tích hợp đa tiện ích. Không chỉ là nơi ở, mà còn là không gian sống thông minh với trường học, bệnh viện, trung tâm thương mại ngay trong khu vực.'\n\nDự báo cho quý 4/2024, thị trường sẽ tiếp tục xu hướng tích cực với hơn 15 dự án lớn được mở bán. Các chuyên gia khuyến nghị nhà đầu tư nên tập trung vào các dự án có pháp lý rõ ràng, vị trí thuận lợi và được phát triển bởi các chủ đầu tư uy tín.\n\nVới lãi suất ngân hàng dự kiến sẽ tiếp tục giảm trong năm 2025, đây được coi là thời điểm vàng để các gia đình trẻ thực hiện ước mơ sở hữu nhà riêng.",
        excerpt:
          "BĐS Q4/2024 tăng trưởng 23%, gói tín dụng 120.000 tỷ đồng lãi suất 6.5% thu hút nhà đầu tư.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        author: {
          id: "3",
          name: "Lê Kinh Doanh",
          avatarUrl: "https://i.pravatar.cc/150?img=3",
        },
        tags: ["bđs", "đầu tư", "q4"],
        comments: [],
      },
      {
        id: "4",
        title:
          "Phim 'Avatar 3' tung trailer mới: Hành trình khám phá đại dương Pandora",
        category: "Giải trí",
        content:
          "James Cameron vừa tung ra trailer mới nhất của Avatar 3, hứa hẹn mang đến những trải nghiệm thị giác choáng ngợp. Phần phim mới sẽ đưa khán giả khám phá thế giới đại dương kỳ bí của hành tinh Pandora với những sinh vật biển độc đáo và công nghệ CGI tiên tiến nhất. Dự kiến ra mắt vào cuối năm 2025.\n\nTrailer dài 3 phút 45 giây đã thu hút hơn 85 triệu lượt xem chỉ trong 48 giờ đầu phát hành trên YouTube. Cảnh mở đầu cho thấy gia đình Jake Sully lặn sâu xuống đại dương Pandora, nơi họ gặp gỡ bộ tộc Metkayina - những người Na'vi sống dưới nước với khả năng nín thở lên đến 15 phút.\n\nĐạo diễn James Cameron, người đã dành 8 năm để phát triển Avatar 3, chia sẻ: 'Chúng tôi đã sử dụng công nghệ quay phim dưới nước hoàn toàn mới, cho phép ghi hình những cảnh hành động phức tạp ở độ sâu 20 mét. Đây là điều chưa từng có trong lịch sử điện ảnh.'\n\nÔng Cameron và ekip đã hợp tác với các chuyên gia sinh vật học biển để thiết kế hơn 200 loài sinh vật đại dương Pandora. Trong số đó, con Tulkun - loài cá voi thông minh có thể giao tiếp bằng sóng âm phức tạp - được coi là nhân vật quan trọng nhất của phim.\n\nDiễn viên Sam Worthington, người thủ vai Jake Sully, cho biết anh đã phải tập luyện lặn chuyên nghiệp trong 6 tháng: 'Cameron yêu cầu chúng tôi thực sự nín thở dưới nước để có được biểu cảm tự nhiên nhất. Có những cảnh quay kéo dài 7 phút mà chúng tôi phải ở dưới nước liên tục.'\n\nZoe Saldana, người thủ vai Neytiri, cũng chia sẻ về trải nghiệm quay phim: 'Làm việc với Cameron luôn là thử thách. Ông ấy muốn mọi chi tiết đều hoàn hảo. Chúng tôi đã quay hơn 400 giờ cảnh dưới nước chỉ để có được 45 phút cảnh phim cuối cùng.'\n\nPhần soundtrack của Avatar 3 do Hans Zimmer sáng tác, kết hợp với âm thanh thực tế của đại dương được thu âm tại 12 địa điểm khác nhau trên thế giới. Hệ thống âm thanh Dolby Atmos đặc biệt đã được phát triển riêng cho phim, tạo ra cảm giác như khán giả đang thực sự ở dưới đại dương.\n\nTại Việt Nam, phim sẽ được phát hành đồng thời với toàn thế giới vào ngày 18/12/2025. Hệ thống rạp CGV và Lotte Cinema đã bắt đầu nhận đặt vé trước từ tháng 11. Dự kiến Avatar 3 sẽ có phiên bản 3D, IMAX và định dạng 4DX để mang đến trải nghiệm tối đa cho khán giả.\n\nVới kinh phí sản xuất lên đến 460 triệu USD, Avatar 3 được kỳ vọng sẽ phá vỡ nhiều kỷ lục phòng vé như hai phần trước đã làm.",
        excerpt:
          "Avatar 3 trailer đạt 85 triệu views, Cameron sử dụng công nghệ quay phim dưới nước mới, ra mắt 18/12/2025.",
        thumbnailUrl:
          "https://images.thedirect.com/media/article_full/avatar-3-villain.jpg", // New underwater theme cho Avatar 3
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        author: {
          id: "4",
          name: "Phạm Giải Trí",
          avatarUrl: "https://i.pravatar.cc/150?img=4",
        },
        tags: ["avatar 3", "phim", "cameron"],
        comments: [],
      },
      {
        id: "5",
        title: "AI ChatGPT-5 ra mắt: Cuộc cách mạng trí tuệ nhân tạo tiếp tục",
        category: "Công nghệ",
        content:
          "OpenAI vừa chính thức công bố phiên bản ChatGPT-5 với những cải tiến đáng kể về khả năng xử lý ngôn ngữ và hiểu biết ngữ cảnh. Phiên bản mới có thể xử lý các tác vụ phức tạp hơn, hỗ trợ đa ngôn ngữ tốt hơn và có khả năng suy luận logic tiến bộ. Đây được coi là bước tiến quan trọng trong cuộc đua AI toàn cầu.\n\nCEO Sam Altman của OpenAI trong buổi keynote tại San Francisco đã giới thiệu những khả năng đột phá của ChatGPT-5. Phiên bản mới sử dụng kiến trúc GPT-5 với 1.8 nghìn tỷ tham số, gấp 10 lần so với GPT-4, cho phép xử lý thông tin với độ chính xác và sâu sắc chưa từng có.\n\nMột trong những cải tiến nổi bật nhất là khả năng 'suy luận chuỗi' (chain reasoning). ChatGPT-5 có thể phân tích các vấn đề phức tạp qua nhiều bước logic, giống như cách con người giải quyết vấn đề. Trong các bài test toán học nâng cao, ChatGPT-5 đạt tỷ lệ chính xác 94.7%, vượt xa các phiên bản trước.\n\nTS. Lê Viết Quốc, chuyên gia AI tại Đại học Stanford, nhận định: 'ChatGPT-5 đánh dấu bước ngoặt quan trọng trong phát triển AI. Khả năng hiểu ngữ cảnh và suy luận logic của nó đã đạt đến mức gần như tương đương với con người trong nhiều lĩnh vực.'\n\nVề khả năng đa ngôn ngữ, ChatGPT-5 hỗ trợ 127 ngôn ngữ, trong đó tiếng Việt được đánh giá có chất lượng xuất sắc. Hệ thống có thể hiểu và sử dụng các thành ngữ, tục ngữ Việt Nam một cách tự nhiên, thậm chí có thể sáng tác thơ theo thể loại lục bát hay thất ngôn tứ tuyệt.\n\nTrong lĩnh vực lập trình, ChatGPT-5 có thể viết code cho hơn 50 ngôn ngữ lập trình khác nhau. Đặc biệt, nó có khả năng debug, tối ưu hóa code và đưa ra gợi ý cải thiện hiệu suất một cách chi tiết. Các lập trình viên beta test cho biết năng suất làm việc của họ đã tăng trung bình 340%.\n\nOpenAI cũng giới thiệu tính năng 'Multimodal Pro' cho phép ChatGPT-5 xử lý đồng thời văn bản, hình ảnh, âm thanh và video. Hệ thống có thể phân tích một đoạn video 10 phút và tóm tắt nội dung chi tiết chỉ trong 30 giây.\n\nTuy nhiên, ChatGPT-5 cũng đặt ra những lo ngại về tác động xã hội. Nhiều chuyên gia lo ngại về việc mất việc làm trong các ngành văn phòng và dịch vụ khách hàng. OpenAI cam kết sẽ đầu tư 2 tỷ USD vào các chương trình đào tạo lại nghề nghiệp.\n\nChatGPT-5 sẽ có 3 gói dịch vụ: Basic (miễn phí), Pro ($30/tháng) và Enterprise ($200/tháng). Tại Việt Nam, dịch vụ sẽ chính thức ra mắt vào ngày 15/9/2025 với giao diện hoàn toàn bằng tiếng Việt.",
        excerpt:
          "ChatGPT-5 với 1.8 nghìn tỷ tham số, độ chính xác 94.7%, hỗ trợ 127 ngôn ngữ, ra mắt VN 15/9/2025.",
        thumbnailUrl:
          "https://assets.anakin.ai/blog/2023/11/ChatGPT-5-BY-Open-AI.jpeg",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        author: {
          id: "5",
          name: "Nguyễn Thời Trang",
          avatarUrl: "https://i.pravatar.cc/150?img=5",
        },
        tags: ["AI", "ChatGPT", "công nghệ", "OpenAI"],
        comments: [],
      },
      {
        id: "6",
        title: "World Cup 2026: Việt Nam có cơ hội lớn vào vòng chung kết",
        category: "Thể thao",
        content:
          "Với sự chuẩn bị kỹ lưỡng và đội hình ngày càng mạnh mẽ, đội tuyển Việt Nam đang có những bước tiến đáng kể trên đường đua tới World Cup 2026. HLV Park Hang-seo đã xây dựng được một lối chơi ổn định và hiệu quả. Các cầu thủ trẻ đang được đào tạo bài bản, hứa hẹn sẽ tạo nên những bất ngờ trong khu vực.\n\nSau thành công vang dội tại AFF Cup 2024 với chức vô địch thuyết phục, đội tuyển Việt Nam đã leo lên vị trí thứ 94 trên bảng xếp hạng FIFA, cao nhất trong lịch sử. Đây là nền tảng vững chắc để hướng tới mục tiêu lọt vào vòng chung kết World Cup 2026 tại Mỹ, Canada và Mexico.\n\nHLV Park Hang-seo đã triển khai chiến lược dài hạn với việc tuyển chọn và đào tạo 45 cầu thủ trẻ từ các lứa U19, U21. Trung tâm đào tạo PVF và HAGL JMG đã trở thành 'lò' sản xuất tài năng, cung cấp nguồn nhân lực chất lượng cao cho đội tuyển quốc gia.\n\nCầu thủ Nguyễn Hoàng Đức được coi là biểu tượng của thế hệ mới. Với 28 bàn thắng trong 35 trận đấu cho đội tuyển, Hoàng Đức đã trở thành chân sút số 1 và là hy vọng lớn cho World Cup 2026. FIFA đã xếp anh trong top 20 tiền đạo xuất sắc nhất châu Á.\n\nỞ tuyến giữa, Nguyễn Tuấn Anh và Phan Văn Đức tạo nên bộ đôi ăn ý với khả năng kiến tạo và ghi bàn ấn tượng. Đặc biệt, Tuấn Anh đã có 18 đường kiến tạo thành bàn trong 24 trận gần nhất, được nhiều câu lạc bộ châu Âu quan tâm.\n\nHàng thủ Việt Nam cũng đã có những cải thiện đáng kể với trung tâm Đoàn Văn Hậu và Bùi Tiến Dũng. Trong 12 trận gần nhất, đội tuyển chỉ để lọt lưới 3 bàn, thành tích tốt nhất Đông Nam Á. Thủ môn Đặng Văn Lâm tiếp tục là chốt chặn đáng tin cậy với tỷ lệ cứu thua 89%.\n\nVề mặt chiến thuật, HLV Park Hang-seo đã phát triển lối chơi linh hoạt với 3 sơ đồ chính: 4-2-3-1 tấn công, 5-3-2 phòng ngự và 4-4-2 cân bằng. Đội tuyển Việt Nam có thể thích ứng với nhiều đối thủ khác nhau, từ các đội mạnh châu Á đến những đối thủ phòng ngự chặt chẽ.\n\nBan lãnh đạo VFF đã đầu tư 120 tỷ đồng để nâng cấp cơ sở vật chất tại Trung tâm đào tạo Việt Trì. Sân tập hiện đại với hệ thống phân tích video AI, phòng gym tiêu chuẩn quốc tế và khu phục hồi chấn thương đã giúp các cầu thủ nâng cao thể lực và kỹ thuật.\n\nTheo lộ trình của AFC, vòng loại World Cup 2026 khu vực châu Á sẽ bắt đầu từ tháng 3/2025. Việt Nam được xếp vào nhóm hat giống số 3, có cơ hội gặp những đối thủ vừa sức như Thái Lan, Malaysia, Indonesia trong vòng bảng.\n\n'Chúng tôi đã chuẩn bị rất kỹ lưỡng cho mục tiêu World Cup 2026. Với tinh thần đoàn kết và sự ủng hộ của người hâm mộ, tôi tin đội tuyển Việt Nam sẽ tạo nên kỳ tích,' HLV Park Hang-seo tự tin chia sẻ.",
        excerpt:
          "Đội tuyển VN lên hạng 94 FIFA, HLV Park chuẩn bị 45 cầu thủ trẻ cho World Cup 2026, vòng loại bắt đầu 3/2025.",
        thumbnailUrl: "https://wallpapercave.com/wp/wp15010587.webp", // World Cup/Soccer theme
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        author: {
          id: "6",
          name: "Hoàng Bóng Đá",
          avatarUrl: "https://i.pravatar.cc/150?img=6",
        },
        tags: ["worldcup", "việt nam", "bóng đá", "2026"],
        comments: [],
      },
    ])
  );
  const [favorites, setFavorites] = useState(
    () => new Set(readJSON("favorites", []))
  );
  const [favoriteExternalItems, setFavoriteExternalItems] = useState(() =>
    readJSON("favorite_external_items", {})
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Save to localStorage with automatic cleanup
  useEffect(() => {
    try {
      writeJSON("current_user", currentUser);
    } catch (error) {
      console.error("Lỗi lưu current_user:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      writeJSON("is_authenticated", isAuthenticated);
    } catch (error) {
      console.error("Lỗi lưu is_authenticated:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      writeJSON("users", users);
    } catch (error) {
      console.error("Lỗi lưu users:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      writeJSON("posts", posts);
    } catch (error) {
      console.error("Lỗi lưu posts:", error);
      // Nếu lỗi, thử cleanup và lưu lại
      cleanupLocalStorage();
      try {
        writeJSON("posts", posts);
      } catch (retryError) {
        console.error("Vẫn không thể lưu posts sau khi cleanup:", retryError);
      }
    }
  }, [posts]);

  useEffect(() => {
    try {
      writeJSON("favorites", Array.from(favorites));
    } catch (error) {
      console.error("Lỗi lưu favorites:", error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      writeJSON("favorite_external_items", favoriteExternalItems);
    } catch (error) {
      console.error("Lỗi lưu favorite_external_items:", error);
    }
  }, [favoriteExternalItems]);

  // Auth functions
  const login = useCallback(
    (username, password, googleUser = null) => {
      if (googleUser) {
        // Check current users synchronously to prefer existing avatar
        const existingByEmail = users.find((u) => u.email === googleUser.email);
        const existingById = users.find(
          (u) => String(u.id) === String(googleUser.id)
        );
        const existing = existingByEmail || existingById || null;

        const merged = existing
          ? {
              ...existing,
              ...googleUser,
              avatarUrl: existing.avatarUrl || googleUser.avatarUrl,
              isGoogleUser: true,
            }
          : { ...googleUser };

        setUsers((prev) => {
          if (existing) {
            return prev.map((u) =>
              String(u.id) === String(merged.id) || u.email === merged.email
                ? merged
                : u
            );
          }
          return [...prev, merged];
        });

        setCurrentUser({
          id: merged.id,
          name: merged.name,
          avatarUrl: merged.avatarUrl,
          isGoogleUser: true,
        });
        setIsAuthenticated(true);
        return true;
      }

      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [users]
  );

  const register = useCallback(
    (username, email, password) => {
      if (users.find((u) => u.username === username)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        name: username,
        avatarUrl: "",
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser({
        id: newUser.id,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
      });
      setIsAuthenticated(true);
      return true;
    },
    [users]
  );

  function logout() {
    setCurrentUser({ id: "guest", name: "Khách" });
    setIsAuthenticated(false);
  }

  // App functions
  function addPost(post) {
    setPosts((prev) => [
      { ...post, id: post.id || Date.now().toString() },
      ...prev,
    ]);
    // If the current user is the author, increment their post count
    setCurrentUser((prev) => {
      try {
        if (!prev) return prev;
        const authorId = post.author?.id || post.id;
        if (prev.id && authorId && prev.id === authorId) {
          const postsCount = (prev.postsCount || 0) + 1;
          return { ...prev, postsCount };
        }
        return prev;
      } catch {
        return prev;
      }
    });
  }

  const toggleFavorite = useCallback((postId) => {
    // Toggle in a functional way and derive favoritesCount from set size to avoid
    // negative counts or out-of-sync values.
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      // Keep user favoritesCount consistent with the Set size
      setCurrentUser((cu) => {
        if (!cu) return cu;
        return { ...cu, favoritesCount: next.size };
      });
      return next;
    });
  }, []);

  function toggleFavoriteExternal(item) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      // Mirror favoritesCount with the Set size
      setCurrentUser((cu) => {
        if (!cu) return cu;
        return { ...cu, favoritesCount: next.size };
      });
      return next;
    });
    setFavoriteExternalItems((prev) => {
      const next = { ...prev };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      return next;
    });
  }

  function addComment(postId, comment) {
    const ensureId = (c) =>
      c && c.id
        ? c
        : {
            ...c,
            id: `${postId}_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2, 7)}`,
          };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), ensureId(comment)] }
          : p
      )
    );
    // if current user authored the comment, increment their comment count
    setCurrentUser((prev) => {
      try {
        if (!prev) return prev;
        const commenterId = comment?.author?.id || comment?.id;
        if (prev.id && commenterId && prev.id === commenterId) {
          const commentsCount = (prev.commentsCount || 0) + 1;
          return { ...prev, commentsCount };
        }
        return prev;
      } catch {
        return prev;
      }
    });
  }

  // (was) Update a post fields — removed because UI no longer allows inline edits here

  function updateUser(updates) {
    // Update both the currentUser state and the users collection so
    // components that read from `users` (e.g. comment rendering) see
    // the latest profile changes immediately.
    setCurrentUser((prev) => {
      const next = { ...prev, ...updates };
      // Also patch the users array if the user exists there
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          String(u.id) === String(next.id) ? { ...u, ...updates } : u
        )
      );
      // Also update any posts/comments that stored the old author snapshot
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          let changed = false;
          const newPost = { ...p };
          if (newPost.author && String(newPost.author.id) === String(next.id)) {
            newPost.author = { ...newPost.author, ...updates };
            changed = true;
          }
          if (Array.isArray(newPost.comments) && newPost.comments.length) {
            const newComments = newPost.comments.map((c) =>
              c?.author && String(c.author.id) === String(next.id)
                ? { ...c, author: { ...c.author, ...updates } }
                : c
            );
            // only replace if changed to avoid unnecessary updates
            if (
              JSON.stringify(newComments) !== JSON.stringify(newPost.comments)
            ) {
              newPost.comments = newComments;
              changed = true;
            }
          }
          return changed ? newPost : p;
        })
      );
      return next;
    });
  }

  function clearAllData() {
    try {
      // Persist empty collections so the app won't reload seeded default posts
      writeJSON("posts", []);
      writeJSON("favorites", []);
      writeJSON("favorite_external_items", {});
      // Also reset auth to guest
      writeJSON("current_user", { id: "guest", name: "Khách" });
    } catch {
      console.error("Lỗi khi xóa dữ liệu ứng dụng");
      // fallback to removing keys
      localStorage.removeItem("posts");
      localStorage.removeItem("favorites");
      localStorage.removeItem("favorite_external_items");
    }
    window.location.reload();
  }

  const value = useMemo(
    () => ({
      // Auth
      currentUser,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,

      // App
      posts,
      addPost,
      addComment,
      users,
      categories: ["Công nghệ", "Kinh doanh", "Thể thao", "Giải trí"],
      favorites,
      toggleFavorite,
      favoriteExternalItems,
      toggleFavoriteExternal,
      searchKeyword,
      setSearchKeyword,
      selectedCategory,
      setSelectedCategory,
      clearAllData,
    }),
    [
      currentUser,
      isAuthenticated,
      users,
      posts,
      favorites,
      favoriteExternalItems,
      searchKeyword,
      selectedCategory,
      login,
      register,
      toggleFavorite,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook export for consumers
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
