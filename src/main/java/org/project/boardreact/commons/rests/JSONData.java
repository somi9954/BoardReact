package org.project.boardreact.commons.rests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor @RequiredArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JSONData<T>{
    private boolean success = true;
    private HttpStatus status = HttpStatus.OK;
    @NonNull
    private T data;
    private Object message;
    private Object code;
}
