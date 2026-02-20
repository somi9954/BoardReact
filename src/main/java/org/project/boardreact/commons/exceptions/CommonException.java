package org.project.boardreact.commons.exceptions;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class CommonException extends  RuntimeException{
    private HttpStatus status;
    private Map<String, List<String>> messages;

    public CommonException(Map<String, ?> messages, HttpStatus status) {
        super();
        this.status = status;
        this.messages = normalizeMessages(messages);
    }

    public CommonException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, List<String>> getMessages() {
        return messages;
    }

    private Map<String, List<String>> normalizeMessages(Map<String, ?> messages) {
        if (messages == null) {
            return Collections.emptyMap();
        }

        return messages.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> {
                    Object value = entry.getValue();

                    if (value instanceof List<?> values) {
                        List<String> normalized = values.stream()
                                .filter(Objects::nonNull)
                                .map(String::valueOf)
                                .toList();

                        return normalized.isEmpty() ? List.of("") : normalized;
                    }

                    if (value == null) {
                        return List.of("");
                    }

                    return new ArrayList<>(List.of(String.valueOf(value)));
                }));
    }
}
