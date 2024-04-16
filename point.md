### 에러 해결
  <details>
    <summary><b>1</b></summary>
    <div markdown="1">
      <ul>
        <li>{"success":true,"status":"OK","data":[{"codes":["NotEmpty.boardConfigForm.bId","NotEmpty.bId","NotEmpty.java.lang.String","NotEmpty"],"arguments":[{"codes":["boardConfigForm.bId","bId"],"arguments":null,"defaultMessage":"bId","code":"bId"}],"defaultMessage":"게시판 이름을 입력하세요.","objectName":"boardConfigForm","field":"bId","rejectedValue":null,"bindingFailure":false,"code":"NotEmpty"},{"codes":["NotBlank.boardConfigForm.bName","NotBlank.bName","NotBlank.java.lang.String","NotBlank"],"arguments":[{"codes":["boardConfigForm.bName","bName"],"arguments":null,"defaultMessage":"bName","code":"bName"}],"defaultMessage":"게시판 이름을 입력하세요.","objectName":"boardConfigForm","field":"bName","rejectedValue":null,"bindingFailure":false,"code":"NotBlank"},{"codes":["NotBlank.boardName.boardConfigForm.bName","NotBlank.boardName.bName","NotBlank.boardName.java.lang.String","NotBlank.boardName"],"arguments":null,"defaultMessage":null,"objectName":"boardConfigForm","field":"bName","rejectedValue":null,"bindingFailure":false,"code":"NotBlank.boardName"}],"message":null,"code":null,"dataList":[]}
</li>
  <li>@DATA를 하였지만 별도로 게터 세터를 정의해주니까 바로 됐다..</li>
      </ul>
    </div>
  </details>
    <details>
    <summary><b>2</b></summary>
    <div markdown="1">
      <ul>
        <li>2024-03-14T02:36:00.793+09:00  WARN 18672 --- [nio-3001-exec-1] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 1406, SQLState: 22001
2024-03-14T02:36:00.793+09:00 ERROR 18672 --- [nio-3001-exec-1] o.h.engine.jdbc.spi.SqlExceptionHelper   : Data truncation: Data too long for column 'b_id' at row 1
2024-03-14T02:36:00.795+09:00 ERROR 18672 --- [nio-3001-exec-1] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: org.springframework.dao.DataIntegrityViolationException: could not execute statement [Data truncation: Data too long for column 'b_id' at row 1] [/* insert for org.project.boardreact.entities.Board */insert into board (active,authority,b_name,category,created_at,created_by,b_id) values (?,?,?,?,?,?,?)]; SQL [/* insert for org.project.boardreact.entities.Board */insert into board (active,authority,b_name,category,created_at,created_by,b_id) values (?,?,?,?,?,?,?)]] with root cause
com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: Data truncation: Data too long for column 'b_id' at row 1
	at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:104) ~[mysql-connector-j-8.3.0.jar:8.3.0]
	at com.mysql.cj.jdbc.ClientPreparedStatement.executeInternal(ClientPreparedStatement.java:912) ~[mysql-connector-j-8.3.0.jar:8.3.0]
</li>
  <li>https://stackoverflow.com/questions/76892088/sql-error-1406-sqlstate-22001-with-springboot-mysql </li>
      </ul>
    </div>
  </details>
      <details>
    <summary><b>3</b></summary>
    <div markdown="1">
      <ul>
       <details>
  boarddata Entity (수정. 지연로딩이 아닌 즉시로딩으로 수정)
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="bId")
    private Board board;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="userNo")
    private Member member;

   @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="bId")
    @ToString.Exclude
    private Board board;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="userNo")
    @ToString.Exclude
    private Member member;



  @GetMapping("/list/{bId}")에서 수정
    public JSONData<List<BoardData>> list(BoardDataSearch search) {
        ListData<BoardData> boardList = infoService.getList(search);
        List<BoardData> data = boardList.getContent();

        JSONData<List<BoardData>> jsonData = new JSONData<>();
        jsonData.setData(data);

        return jsonData;
    }



  @GetMapping("/list/{bId}")
    public JSONData<List<BoardData>> list(@PathVariable("bId") String bId, BoardDataSearch search) {
        search.setBId(bId);
        System.out.println("Received request for board list with bId: " + bId); // 요청된 게시판 ID 출력

        // Adjusting page and limit
        int page = search.getPage();
        int limit = search.getLimit();
        System.out.println("Requested page: " + page); // 요청된 페이지 출력
        System.out.println("Requested limit: " + limit); // 요청된 한 페이지 당 아이템 개수 출력

        // Get board list data from service
        ListData<BoardData> boardList = infoService.getList(search);

        // Convert the retrieved data into JSON format
        JSONData<List<BoardData>> jsonData = new JSONData<>();

        if (boardList != null) {
            jsonData.setData(boardList.getContent());
            System.out.println("Board List Data: " + jsonData); // 게시판 리스트 데이터 출력

            // 서비스에서 가져온 게시판 데이터가 올바른지 확인하기 위해 각 게시물의 bId를 출력합니다.
            for (BoardData boardData : boardList.getContent()) {
                System.out.println("Board ID of the retrieved data: " + boardData.getBoard().getBId());
            }
        } else {
            System.out.println("Board List Data is null");
        }

        return jsonData;
    }



  public ListData<BoardData> getList(BoardDataSearch search) {
        QBoardData boardData = QBoardData.boardData;
        int page = Utils.getNumber(search.getPage(), 1);
        int limit = Utils.getNumber(search.getLimit(), 20);
        int offset = (page - 1) * limit;
        
        String bId = search.getBId(); // 게시판 아이디
        String sopt  = Objects.requireNonNullElse(search.getSopt(), "subject_content"); // 검색 옵션
        String skey = search.getSkey(); // 검색 키워드
        String category = search.getCategory(); // 게시판 분류

        BooleanBuilder andBuilder = new BooleanBuilder();
        andBuilder.and(boardData.board.bId.eq(bId));

        // 게시판 분류 검색 처리
        if (StringUtils.hasText(category)) {
            category = category.trim();
            andBuilder.and(boardData.category.eq(category));
        }


        // 키워드 검색 처리
        if (StringUtils.hasText(skey)) {
            skey = skey.trim();

            if (sopt.equals("subject")) { // 제목 검색
                andBuilder.and(boardData.subject.contains(skey));

            } else if (sopt.equals("content")) { // 내용 검색
                andBuilder.and(boardData.content.contains(skey));

            } else if (sopt.equals("subject_content")) { // 제목 + 내용 검색
                BooleanBuilder orBuilder = new BooleanBuilder();
                orBuilder.or(boardData.subject.contains(skey))
                        .or(boardData.content.contains(skey));

                andBuilder.and(orBuilder);
            } else if (sopt.equals("poster")) { // 작성자 + 아이디
                BooleanBuilder orBuilder = new BooleanBuilder();
                orBuilder.or(boardData.poster.contains(skey))
                        .or(boardData.member.email.contains(skey))
                        .or(boardData.member.userNm.contains(skey));

                andBuilder.and(orBuilder);

            }
        }

        PathBuilder pathBuilder = new PathBuilder(BoardData.class, "boardData");
        List<BoardData> items = new JPAQueryFactory(em)
                .selectFrom(boardData)
                .leftJoin(boardData.board)
                .leftJoin(boardData.member)
                .where(andBuilder)
                .offset(offset)
                .limit(limit)
                .fetchJoin()
                .orderBy(
                        new OrderSpecifier(Order.valueOf("DESC"),
                                pathBuilder.get("createdAt")))
                .fetch();

        int total = (int)boardDataRepository.count(andBuilder);

        Pagination pagination = new Pagination(page, total, 10, limit, request);

        // 파일 정보 추가
        items.stream().forEach(this::addFileInfo);

        ListData<BoardData> data = new ListData<>();
        data.setContent(items);
        data.setPagination(pagination);

        return data;
    }


  public ListData<BoardData> getList(BoardDataSearch search) { infoservice 내 getList 수정
        QBoardData boardData = QBoardData.boardData;
        int page = Objects.requireNonNullElse(search.getPage(), 1);
        int limit = Objects.requireNonNullElse(search.getLimit(), 20);
        int offset = (page - 1) * limit;
        String bId = search.getBId();
        String sopt = StringUtils.hasText(search.getSopt()) ? search.getSopt() : "subject_content";
        String skey = search.getSkey();
        String category = search.getCategory();

        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(boardData.board.bId.eq(bId));

        if (StringUtils.hasText(category)) {
            category = category.trim();
            whereClause.and(boardData.category.eq(category));
        }

        if (StringUtils.hasText(skey)) {
            skey = skey.trim();
            if ("subject".equals(sopt)) {
                whereClause.and(boardData.subject.contains(skey));
            } else if ("content".equals(sopt)) {
                whereClause.and(boardData.content.contains(skey));
            } else if ("subject_content".equals(sopt)) {
                BooleanBuilder orClause = new BooleanBuilder();
                orClause.or(boardData.subject.contains(skey))
                        .or(boardData.content.contains(skey));
                whereClause.and(orClause);
            } else if ("poster".equals(sopt)) {
                BooleanBuilder orClause = new BooleanBuilder();
                orClause.or(boardData.poster.contains(skey))
                        .or(boardData.member.email.contains(skey))
                        .or(boardData.member.nickname.contains(skey));
                whereClause.and(orClause);
            }
        }

        List<BoardData> items = new JPAQueryFactory(entityManager)
                .selectFrom(boardData)
                .leftJoin(boardData.board, board).fetchJoin() // Fetch 조인 사용
                .leftJoin(boardData.member)
                .where(whereClause)
                .offset(offset)
                .limit(limit)
                .orderBy(boardData.createdAt.desc())
                .fetch();

        long total = boardDataRepository.count(whereClause);

        Pagination pagination = new Pagination(page, (int) total, 10, limit, request);
        ListData<BoardData> data = new ListData<>();
        data.setContent(items);
        data.setPagination(pagination);

        return data;
    }
</details>
</li>
  <li>게시판 리스트 목록 불러오기(****)boarddata Entity (수정. 지연로딩이 아닌 즉시로딩으로 수정)</li>
      </ul>
    </div>
  </details>
   <details>
    <summary><b>4</b></summary>
    <div markdown="1">
      <ul>
        <li>2024-04-01T01:58:53.843+09:00 ERROR 14680 --- [nio-3001-exec-6] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: java.lang.IllegalArgumentException: eq(null) is not allowed. Use isNull() instead] with root cause

java.lang.IllegalArgumentException: eq(null) is not allowed. Use isNull() instead
</li>
  <li>https://velog.io/@balparang/Querydsl-BooleanExpression-%EB%A5%BC-%EC%A1%B0%ED%95%A9%ED%95%A0-%EB%95%8C-%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94-NPE-%EB%8C%80%EC%B2%98%ED%95%98%EA%B8%B0</li>
      </ul>
    </div>
  </details>
     <details>
    <summary><b>5</b></summary>
    <div markdown="1">
      <ul>
        <li>Received comment data: CommentForm(seq=null, boardDataSeq=353, poster=사용자10, guestPw=, content=안녕하세요 반갑습니다., member=null, boardData=null)
Error occurred while saving comment: [Field error in object 'commentForm' on field 'guestPw': rejected value []; codes [Size.commentForm.guestPw,Size.guestPw,Size.java.lang.String,Size]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [commentForm.guestPw,guestPw]; arguments []; default message [guestPw],2147483647,4]; default message [크기가 4에서 2147483647 사이여야 합니다]]
</li>
  <li>
    
@Data
public class CommentForm {
    private Long seq; // 댓글 등록 번호 
    private Long boardDataSeq; // 게시글 등록 번호

    @NotBlank
    private String poster;

    private String guestPw; // @size 설정 시 회원도 비밀번호 설정 에러가 발생함.. 원래 @size(min= 4)

    @NotBlank
    private String content;

    private Member member;

    private BoardData boardData;}
    </li>
      </ul>
    </div>
  </details>

#### 찾아보면서 알게된 사항
- https://m.blog.naver.com/sosow0212/222729660808
@OnDelete(action = OnDeleteAction.CASCADE) 어노테이션은 만약에 User가 삭제되면, User에 딸린 댓글은 모두 삭제되는 것이고, Board 즉 게시물이 삭제되면 그 게시물에 딸린 댓글은 모두 삭제하라는 뜻입니다.

  
