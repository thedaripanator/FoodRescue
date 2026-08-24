package com.Spring.FoodRescue.Service;

import com.Spring.FoodRescue.DTO.MlAnalysisResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MlService {

    private final RestClient restClient;

    public MlService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8000")
                .build();
    }

    public MlAnalysisResponse analyzeFood(
            MultipartFile image
    ) throws Exception {

        ByteArrayResource resource =
                new ByteArrayResource(image.getBytes()) {

                    @Override
                    public String getFilename() {
                        return image.getOriginalFilename();
                    }
                };

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("image", resource);

        return restClient.post()
                .uri("/ml/analyze-food")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(MlAnalysisResponse.class);
    }
}