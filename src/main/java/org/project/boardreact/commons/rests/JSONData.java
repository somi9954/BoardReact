package org.project.boardreact.commons.rests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JSONData<T> {
    private boolean success = true;
    private HttpStatus status = HttpStatus.OK;
    @NonNull
    private T data;
    private Object message;
    private Object code;
    private List<Object> dataList = new ArrayList<>(); // 새로운 리스트 필드 추가

    // 키와 값을 받아 dataList에 추가하는 메서드
    public void addData(String key, Object value) {
        dataList.add(Map.entry(key, value));
    }

    // 새로운 데이터를 dataList에 추가하는 메서드
    public void addData(Object data) {
        dataList.add(data);
    }

    // 필요한 데이터를 설정하는 메서드
    public void setDataList(List<Object> dataList) {
        this.dataList = dataList;
    }

}
