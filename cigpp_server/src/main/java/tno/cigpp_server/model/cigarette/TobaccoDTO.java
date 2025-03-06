package tno.cigpp_server.model.cigarette;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TobaccoDTO {

    private Long tobaccoId;
    private String brandName;
    private Integer sizeInGrams;
    private Double price;
}
