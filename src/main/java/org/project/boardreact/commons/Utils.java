package org.project.boardreact.commons;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class Utils {
    private static ResourceBundle validationsBundle;
    private static ResourceBundle errorsBundle;

    private final HttpServletRequest request;

    static {
        validationsBundle = ResourceBundle.getBundle("messages.validations");
        errorsBundle = ResourceBundle.getBundle("messages.errors");
    }

    public static String getMessage(String code, String bundleType) {
        bundleType = Objects.requireNonNullElse(bundleType, "validation");
        ResourceBundle bundle = bundleType.equals("error")? errorsBundle:validationsBundle;
        try {
            return bundle.getString(code);
        } catch (Exception e) {
            return null;
        }
    }

    public static Map<String , List<String>> getMessages(Errors errors) {
        try {
            Map<String, List<String>> data = new HashMap<>();
            for (FieldError error : errors.getFieldErrors()) {
                String field = error.getField();
                //NotBlank, Noblank.email Notblank.requestJoin.email 긴 형태로 정렬 후 적용하기
                List<String> messages = Arrays.stream(error.getCodes()).sorted(Comparator.reverseOrder())
                        .map(c -> getMessage(c, "validation"))
                        .filter(c -> c != null)
                        .toList();

                data.put(field, messages);
            }
            return data;

        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 사이트 설정 조회
     * @param name
     * @return
     */
    public String getConfig(String name) {
        Map<String, String> siteConfig = (Map<String, String>)request.getAttribute("siteConfig");
        String value = siteConfig == null ? "" : siteConfig.get(name);

        return value;
    }

    /**
     * 단일 요청 데이터 조회
     */
    public String getParam(String name) {
        return request.getParameter(name);
    }

    /**
     * 복수개 요청 데이터 조회
     *
     */
    public String[] getParams(String name) {
        return request.getParameterValues(name);
    }


    public static int getNumber(int num, int defaultValue) {

        return num <= 0 ? defaultValue : num;
    }
}